import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { PaymentEntity } from "entities/Payments";

import { checkout } from "./_api";
import { createReceipt } from "./_receipt";

@Injectable()
export class RefundExternalPaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  @Transactional()
  async refundPaymentOrFail(paymentId: string) {
    const payment = await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { author: true },
    });

    await checkout.createRefund({
      payment_id: payment.externalPaymentId,
      amount: { value: payment.amount.toString(), currency: "RUB" },
      receipt: createReceipt(payment),
    });
  }
}
