import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";
import { DictionaryTypes } from "@app/shared-enums";

export class ResponseDictionaryValueDTO {
  @Expose() @IsDefined() @IsString() key!: string;

  @Expose() @IsDefined() @IsString() value!: string;

  @Expose() @IsDefined() @IsBoolean() canDelete!: boolean;
}

export class ResponseDictionaryDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsEnum(DictionaryTypes) type!: DictionaryTypes;

  @Expose() @IsDefined() @IsBoolean() required!: boolean;

  @Expose()
  @IsDefined()
  @Type(() => ResponseDictionaryValueDTO)
  @ValidateNested({ each: true })
  values!: ResponseDictionaryValueDTO[];
}

export class ResponseDictionariesListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseDictionaryDTO)
  @ValidateNested({ each: true })
  list!: ResponseDictionaryDTO[];
}
