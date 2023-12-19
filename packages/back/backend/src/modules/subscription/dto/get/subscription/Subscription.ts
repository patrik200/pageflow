import { Expose } from "class-transformer";
import { IsBoolean, IsDefined, IsNumber, IsOptional } from "class-validator";
import { IsDate, withDefaultValue } from "@app/kit";

export class ResponseSubscriptionDTO {
  @Expose() @IsDefined() @IsBoolean() active!: boolean;

  @Expose() @IsDefined() @IsBoolean() autoRenew!: boolean;

  @Expose() @IsDefined() @IsNumber() @withDefaultValue(0) pricePerMonth!: number;

  @Expose() @IsOptional() @IsDate() nextPaymentAt!: Date | null;

  @Expose() @IsDefined() @IsBoolean() autoPaymentsAvailable!: boolean;
}
