import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PaymentStatus } from "@app/shared-enums";

import { PaymentEntity } from "entities/Payments";

import { checkout } from "./_api";

@Injectable()
export class CancelExternalPaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  @Transactional()
  async cancelPaymentOrFail(paymentId: string) {
    const payment = await this.paymentRepository.findOneOrFail({ where: { id: paymentId } });
    if (payment.status !== PaymentStatus.WAITING_FOR_ACCEPT) return;
    await checkout.cancelPayment(payment.externalPaymentId);
  }
}
