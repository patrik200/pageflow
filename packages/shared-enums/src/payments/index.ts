export enum PaymentStatus {
  WAITING_FOR_PAYMENT = "waiting_for_payment",
  WAITING_FOR_ACCEPT = "waiting_for_accept",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export enum PaymentMode {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}
