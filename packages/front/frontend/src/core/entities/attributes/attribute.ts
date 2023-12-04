import { arrayOfEntitiesDecoder, BaseEntity } from "@app/kit";
import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class AttributeTypeEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() key!: string;

  @Expose() @IsDefined() @IsString() id!: string;
}

export const arrayOfAttributeTypeEntities = arrayOfEntitiesDecoder(AttributeTypeEntity);

export class AttributeValueEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose() @IsDefined() @IsString() value!: string;

  @Expose() @IsDefined() @IsString() id!: string;
}

export const arrayOfAttributeValueEntities = arrayOfEntitiesDecoder(AttributeValueEntity);
