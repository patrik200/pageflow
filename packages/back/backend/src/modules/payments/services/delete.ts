import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaymentEntity } from "entities/Payments";

@Injectable()
export class DeletePaymentService {
  constructor(@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>) {}

  async dangerDeletePaymentOrFail(paymentId: string) {
    return await this.paymentRepository.delete({ id: paymentId });
  }
}
