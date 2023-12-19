import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { AxiosError } from "axios";
import { CryptoService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IPaymentMethodType } from "@a2seven/yoo-checkout/build/types";
import { PaymentMode, PaymentType } from "@app/shared-enums";
import { ErrorResponse } from "@a2seven/yoo-checkout";

import { PaymentEntity } from "entities/Payments";

import { checkout } from "./_api";
import { createReceipt } from "./_receipt";

type CreatePaymentModes = (
  | { mode: PaymentMode.MANUAL; redirectUrl: string; type: PaymentType; savePaymentMethod: boolean }
  | { mode: PaymentMode.AUTOMATIC }
) & {};

@Injectable()
export class CreateExternalPaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private cryptoService: CryptoService,
  ) {}

  private getPaymentMethodType(type: PaymentType): IPaymentMethodType {
    switch (type) {
      case PaymentType.YOO_MONEY:
        return "yoo_money";
      case PaymentType.BANK_CARD:
        return "bank_card";
      case PaymentType.SBP:
        return "sbp";
    }
  }

  private async checkoutCreatePayment(
    options: (
      | { type: "automatic"; paymentMethodId: string }
      | { type: "manual"; savePaymentMethod: boolean; redirectUrl: string; paymentType: PaymentType }
    ) & {
      payment: PaymentEntity;
    },
  ) {
    try {
      if (options.type === "automatic")
        return await checkout.createPayment(
          {
            capture: true,
            save_payment_method: true,
            payment_method_id: options.paymentMethodId,
            description: options.payment.description ?? undefined,
            amount: { value: options.payment.amount.toString(), currency: "RUB" },
            receipt: createReceipt(options.payment),
          },
          this.cryptoService.generateRandom(16),
        );

      return await checkout.createPayment(
        {
          capture: true,
          save_payment_method: options.savePaymentMethod,
          payment_method_data: { type: this.getPaymentMethodType(options.paymentType) },
          description: options.payment.description ?? undefined,
          amount: { value: options.payment.amount.toString(), currency: "RUB" },
          confirmation: { type: "redirect", return_url: options.redirectUrl },
          receipt: createReceipt(options.payment),
        },
        this.cryptoService.generateRandom(16),
      );
    } catch (e) {
      if (e instanceof ErrorResponse) {
        if ("isAxiosError" in e && e.isAxiosError) {
          const error = e as AxiosError;
          throw new Error(`\
Ошибка при создании платежа:
-----Req---- ${JSON.stringify(JSON.parse(error.config.data), null, 2)}
-----Res---- ${JSON.stringify(error.response?.data, null, 2)}
`);
        }
      }

      if (e instanceof Error) throw e;

      throw new Error("Ошибка при создании платежа");
    }
  }

  @Transactional()
  async createPaymentOrFail(paymentId: string, createPaymentMode: CreatePaymentModes) {
    const payment = await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { author: true },
    });

    if (createPaymentMode.mode === PaymentMode.AUTOMATIC) {
      if (!payment.paymentMethodId) throw new Error("Нельзя создать автоплатеж без метода оплаты");
      return await this.checkoutCreatePayment({ type: "automatic", payment, paymentMethodId: payment.paymentMethodId });
    }

    return await this.checkoutCreatePayment({
      type: "manual",
      payment,
      savePaymentMethod: createPaymentMode.savePaymentMethod,
      redirectUrl: createPaymentMode.redirectUrl,
      paymentType: createPaymentMode.type,
    });
  }
}
