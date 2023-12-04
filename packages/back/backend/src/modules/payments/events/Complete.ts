export class PaymentComplete {
  static eventName = "payments.complete";

  constructor(public paymentId: string) {}
}
