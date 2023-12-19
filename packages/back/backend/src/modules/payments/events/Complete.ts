export class PaymentComplete {
  static eventName = "payments.complete";

  constructor(public paymentId: string) {}

  get ok() {
    return "ok";
  }

  get notOk() {
    return "not_ok";
  }
}
