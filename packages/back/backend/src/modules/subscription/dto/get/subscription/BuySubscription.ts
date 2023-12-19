import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsString } from "class-validator";
import { PaymentType } from "@app/shared-enums";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestBuySubscriptionDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEnum(PaymentType, { message: dtoMessageIsValidValue })
  paymentType!: PaymentType;
}

export class ResponseBuySubscriptionDTO {
  @Expose() @IsDefined() @IsString() confirmationUrl!: string;
}
