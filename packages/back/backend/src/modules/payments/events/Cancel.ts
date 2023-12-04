export class PaymentCancel {
  static eventName = "payments.cancel";

  constructor(public paymentId: string) {}
}
