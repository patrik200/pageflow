import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { BaseEntity } from "@app/kit";

export class TokenEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsString() token!: string;
  @Expose() @IsString() refreshToken!: string;
}
