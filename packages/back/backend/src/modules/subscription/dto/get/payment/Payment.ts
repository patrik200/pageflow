import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsDate } from "@app/kit";
import { PaymentMode, PaymentStatus } from "@app/shared-enums";

export class ResponsePaymentDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsOptional() @IsString() confirmationUrl!: string | null;

  @Expose() @IsDefined() @IsEnum(PaymentStatus) status!: PaymentStatus;

  @Expose() @IsDefined() @IsEnum(PaymentMode) mode!: PaymentMode;

  @Expose() @IsDefined() @IsNumber() amount!: number;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;
}

export class ResponsePaymentsListDTO {
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ResponsePaymentDTO)
  list!: ResponsePaymentDTO[];
}
