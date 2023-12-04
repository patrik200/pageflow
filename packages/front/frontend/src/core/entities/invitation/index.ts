import { observable } from "mobx";
import { BaseEntity } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@app/shared-enums";

export class InvitationPayloadEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() clientId!: string;
  @observable @Expose() @IsDefined() @IsString() name!: string;
  @observable @Expose() @IsDefined() @IsString() email!: string;
  @observable @Expose() @IsDefined() @IsEnum(UserRole) role!: UserRole;
  @observable @Expose() @IsOptional() @IsString() phone?: string;
  @observable @Expose() @IsOptional() @IsString() position?: string;
}
