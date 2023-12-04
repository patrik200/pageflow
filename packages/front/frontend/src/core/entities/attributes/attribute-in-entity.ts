import { BaseEntity, makeTransformableObject } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsString, ValidateNested } from "class-validator";
import { computed } from "mobx";

import { EditableAttributeInEntityEntity } from "./editable-attribute-in-entity";

export class AttributeInEntityTypeEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsDefined()
  @IsString()
  key!: string;
}

export class AttributeInEntityEntity extends BaseEntity {
  static buildFromEditableAttributeInEntity(entity: EditableAttributeInEntityEntity) {
    return makeTransformableObject(AttributeInEntityEntity, () => ({
      value: entity.value,
      attributeType: {
        key: entity.type,
      },
    }));
  }

  constructor() {
    super();
    this.initEntity();
  }

  @Expose()
  @IsDefined()
  @IsString()
  value!: string;

  @Expose()
  @IsDefined()
  @Type(() => AttributeInEntityTypeEntity)
  @ValidateNested()
  attributeType!: AttributeInEntityTypeEntity;

  @computed get apiFindReady() {
    return {
      attributeTypeKey: this.attributeType.key,
      value: this.value,
    };
  }
}
