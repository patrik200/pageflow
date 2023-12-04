import { Injectable } from "@nestjs/common";
import { PaymentStatus } from "@app/shared-enums";

import { checkout } from "./_api";

@Injectable()
export class GetExternalPaymentInfoService {
  async getInfoOrFail(externalPaymentId: string) {
    const payment = await checkout.getPayment(externalPaymentId);
    if (payment.status === "canceled") return { status: PaymentStatus.CANCELED } as const;
    if (payment.status === "pending") return { status: PaymentStatus.WAITING_FOR_PAYMENT } as const;
    if (payment.status === "waiting_for_capture") return { status: PaymentStatus.WAITING_FOR_ACCEPT } as const;
    if (payment.status === "succeeded")
      return {
        status: PaymentStatus.COMPLETED,
        paymentMethodId: payment.payment_method.saved ? payment.payment_method.id : null,
      } as const;

    throw new Error("Unknown state");
  }
}
