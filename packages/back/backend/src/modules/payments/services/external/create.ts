import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import type { IReceipt } from "@a2seven/yoo-checkout";
import { CryptoService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ICheckoutCustomer } from "@a2seven/yoo-checkout/build/types";
import { PaymentMode } from "@app/shared-enums";

import { PaymentEntity } from "entities/Payments";

import { checkout } from "./_api";

type CreatePaymentModes = { mode: PaymentMode.MANUAL; redirectUrl: string } | { mode: PaymentMode.AUTOMATIC };

@Injectable()
export class CreateExternalPaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private cryptoService: CryptoService,
  ) {}

  private getReceipt(payment: PaymentEntity): IReceipt {
    const customer: ICheckoutCustomer = { email: payment.author.email, full_name: payment.author.name };
    if (payment.author.phone) customer.phone = payment.author.phone;

    return {
      customer,
      items: [
        {
          description: payment.description ?? "Нет описания",
          quantity: "1",
          amount: { value: payment.amount.toString(), currency: "RUB" },
          vat_code: 1,
        },
      ],
    };
  }

  @Transactional()
  async createPaymentOrFail(paymentId: string, createPaymentMode: CreatePaymentModes) {
    const payment = await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { author: true },
    });

    if (createPaymentMode.mode === PaymentMode.AUTOMATIC) {
      if (!payment.paymentMethodId) throw new Error("Нельзя создать автоплатеж без метода оплаты");
    }

    return await checkout.createPayment(
      {
        save_payment_method: true,
        payment_method_data: payment.paymentMethodId ? undefined : { type: "bank_card" },
        payment_method_id: payment.paymentMethodId ?? undefined,
        description: payment.description ?? undefined,
        amount: { value: payment.amount.toString(), currency: "RUB" },
        confirmation:
          createPaymentMode.mode === PaymentMode.AUTOMATIC
            ? undefined
            : { type: "redirect", return_url: createPaymentMode.redirectUrl },
        receipt: this.getReceipt(payment),
      },
      this.cryptoService.generateRandom(16),
    );
  }
}
