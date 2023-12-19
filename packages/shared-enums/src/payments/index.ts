export enum PaymentStatus {
  WAITING_FOR_PAYMENT = "waiting_for_payment",
  COMPLETED = "completed",
  CANCELED = "canceled",
  REFUND = "refund",
}

export enum PaymentMode {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

export enum PaymentType {
  SBP = "sbp",
  BANK_CARD = "bank_card",
  YOO_MONEY = "yoo_money",
}
