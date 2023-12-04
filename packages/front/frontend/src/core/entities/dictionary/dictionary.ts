import { observable } from "mobx";
import { arrayOfEntitiesDecoder, BaseEntity } from "@app/kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";
import { DictionaryTypes } from "@app/shared-enums";

export class DictionaryValueEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() key!: string;

  @observable @Expose() @IsDefined() @IsString() value!: string;

  @observable @Expose() @IsDefined() @IsBoolean() canDelete!: boolean;
}

export class DictionaryEntity extends BaseEntity {
  constructor() {
    super();
    this.initEntity();
  }

  @observable @Expose() @IsDefined() @IsString() id!: string;

  @observable @Expose() @IsDefined() @IsEnum(DictionaryTypes) type!: DictionaryTypes;

  @observable @Expose() @IsDefined() @IsBoolean() required!: boolean;

  @observable
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => DictionaryValueEntity)
  values!: DictionaryValueEntity[];

  reorderValues = this.createReorder("values", "key");
}

export const arrayOfDictionaryEntitiesDecoder = arrayOfEntitiesDecoder(DictionaryEntity);
