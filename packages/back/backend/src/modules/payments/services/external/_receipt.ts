import { IReceipt } from "@a2seven/yoo-checkout";
import { ICheckoutCustomer } from "@a2seven/yoo-checkout/build/types";

import { PaymentEntity } from "entities/Payments";

export function createReceipt(payment: PaymentEntity): IReceipt {
  const customer: ICheckoutCustomer = { email: payment.author.email, full_name: payment.author.name };
  if (payment.author.phone) customer.phone = payment.author.phone;

  return {
    customer,
    items: [
      {
        description: payment.description ?? "Нет описания",
        quantity: "1",
        amount: { value: payment.amount.toString(), currency: "RUB" },
        vat_code: 1,
      },
    ],
  };
}
