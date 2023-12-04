import { action, observable } from "mobx";
import { BaseEntity, IsDate } from "@app/kit";
import { Expose } from "class-transformer";
import { IsBoolean, IsDefined, IsNumber, IsOptional } from "class-validator";

export class SubscriptionEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsBoolean() active!: boolean;

  @observable @Expose() @IsDefined() @IsBoolean() autoRenew!: boolean;

  @observable @Expose() @IsDefined() @IsNumber() pricePerMonth!: number;

  @observable @Expose() @IsOptional() @IsDate() nextPaymentAt!: Date | null;

  @action cancel = () => {
    this.autoRenew = false;
  };
}
