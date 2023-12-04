import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { runOnTransactionRollback, Transactional } from "typeorm-transactional";
import { PaymentMode, PaymentStatus } from "@app/shared-enums";

import { PaymentEntity } from "entities/Payments";

import { GetUserService } from "modules/users/services/user/get";

import { checkout } from "./external/_api";
import { CreateExternalPaymentService } from "./external/create";

type CreatePaymentInterface = {
  amount: number;
  description?: string;
  subscriptionId: string;
} & ({ mode: PaymentMode.MANUAL; redirectUrl: string } | { mode: PaymentMode.AUTOMATIC; paymentMethodId: string });

@Injectable()
export class CreatePaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    private createExternalPaymentService: CreateExternalPaymentService,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
  ) {}

  private async cancelExternalPaymentOrFail(externalPaymentId: string) {
    return await checkout.cancelPayment(externalPaymentId);
  }

  @Transactional()
  async createPaymentOrFail(options: CreatePaymentInterface, userId: string) {
    const user = await this.getUserService.getUserOrFail(userId, "id", { unsafe: true, loadClient: true });

    const savedPayment = await this.paymentRepository.save({
      client: { id: user.client.id },
      author: { id: user.id },
      status: PaymentStatus.WAITING_FOR_PAYMENT,
      subscription: { id: options.subscriptionId },
      amount: options.amount,
      description: options.description,
      mode: options.mode,
      paymentMethodId: options.mode === PaymentMode.AUTOMATIC ? options.paymentMethodId : undefined,
    });

    const externalPayment = await this.createExternalPaymentService.createPaymentOrFail(savedPayment.id, options);

    runOnTransactionRollback(() => this.cancelExternalPaymentOrFail(externalPayment.id));

    await this.paymentRepository.update(savedPayment.id, {
      externalPaymentId: externalPayment.id,
      confirmationUrl: externalPayment.confirmation?.confirmation_url ?? null,
    });

    return {
      savedPaymentId: savedPayment.id,
      externalPaymentId: externalPayment.id,
      confirmationUrl: externalPayment.confirmation?.confirmation_url,
    };
  }
}
