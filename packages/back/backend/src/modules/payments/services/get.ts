import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PaymentStatus } from "@app/shared-enums";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

import { PaymentEntity } from "entities/Payments";

@Injectable()
export class GetPaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  async dangerGetPaymentsList(options: FindManyOptions<PaymentEntity>) {
    return await this.paymentRepository.find(options);
  }

  async dangerGetPaymentsListInStatuses(statuses: PaymentStatus[]) {
    return await this.dangerGetPaymentsList({ where: { status: In(statuses) } });
  }

  async dangerGetPayment(paymentId: string, options: { loadClient?: boolean } = {}) {
    return await this.paymentRepository.findOneOrFail({
      where: { id: paymentId },
      relations: { client: options.loadClient },
    });
  }

  async dangerGetPaymentsListForSubscription(subscriptionId: string) {
    return await this.paymentRepository.find({
      where: { subscription: { id: subscriptionId } },
      order: { createdAt: "DESC" },
    });
  }

  async dangerGetLastPayment(subscriptionId: string, options: { loadAuthor?: boolean } = {}) {
    return await this.paymentRepository.findOne({
      where: { subscription: { id: subscriptionId } },
      order: { createdAt: "DESC" },
      relations: { author: options.loadAuthor },
    });
  }
}
