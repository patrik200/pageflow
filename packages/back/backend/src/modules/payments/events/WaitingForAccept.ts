export class PaymentWaitingForAccept {
  static eventName = "payments.waitingForAccept";

  constructor(public paymentId: string) {}

  get ok() {
    return "ok";
  }
}
