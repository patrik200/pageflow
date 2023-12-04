import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PaymentStatus } from "@app/shared-enums";

import { PaymentEntity } from "entities/Payments";

@Injectable()
export class GetPaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  async dangerGetPaymentsList(statuses: PaymentStatus[]) {
    return await this.paymentRepository.find({ where: { status: In(statuses) } });
  }

  async dangerGetPayment(paymentId: string, options: { loadClient?: boolean } = {}) {
    return await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { client: options.loadClient },
    });
  }

  async unsafeGetPaymentsListForSubscription(subscriptionId: string) {
    return await this.paymentRepository.find({
      where: { subscription: { id: subscriptionId } },
      order: { createdAt: "DESC" },
    });
  }

  async unsafeGetLastPayment(subscriptionId: string, options: { loadAuthor?: boolean } = {}) {
    return await this.paymentRepository.findOne({
      where: { subscription: { id: subscriptionId } },
      order: { createdAt: "DESC" },
      relations: { author: options.loadAuthor },
    });
  }
}
