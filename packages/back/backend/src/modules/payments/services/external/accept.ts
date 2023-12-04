import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { PaymentEntity } from "entities/Payments";

import { checkout } from "./_api";

@Injectable()
export class AcceptExternalPaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  @Transactional()
  async acceptPaymentOrFail(paymentId: string) {
    const payment = await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { author: true },
    });

    await checkout.capturePayment(payment.externalPaymentId, {});
  }
}
