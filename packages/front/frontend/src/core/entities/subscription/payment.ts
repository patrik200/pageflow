import { computed, observable } from "mobx";
import { arrayOfEntitiesDecoder, BaseEntity, IsDate } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMode, PaymentStatus } from "@app/shared-enums";

export class PaymentEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsOptional() @IsString() confirmationUrl!: string | null;

  @observable @Expose() @IsDefined() @IsEnum(PaymentStatus) status!: PaymentStatus;

  @observable @Expose() @IsDefined() @IsEnum(PaymentMode) mode!: PaymentMode;

  @observable @Expose() @IsDefined() @IsNumber() amount!: number;

  @observable @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @computed get needContinuePayment() {
    return this.status === PaymentStatus.WAITING_FOR_PAYMENT;
  }
}

export const arrayOfPaymentEntitiesDecoder = arrayOfEntitiesDecoder(PaymentEntity);
