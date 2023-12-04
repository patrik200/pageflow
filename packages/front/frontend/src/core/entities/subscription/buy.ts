import { observable } from "mobx";
import { BaseEntity } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class SubscriptionBuyEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() confirmationUrl!: string;
}
