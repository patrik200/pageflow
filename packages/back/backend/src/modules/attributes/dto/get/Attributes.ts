import { Expose, Type } from "class-transformer";
import { IsDefined, IsString, ValidateNested } from "class-validator";

export class ResponseAttributeTypeDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() key!: string;
}

export class ResponseAttributeTypesDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseAttributeTypeDTO)
  @ValidateNested({ each: true })
  types!: ResponseAttributeTypeDTO[];
}

export class ResponseAttributeValueDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() value!: string;
}

export class ResponseAttributeValuesDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseAttributeValueDTO)
  @ValidateNested({ each: true })
  values!: ResponseAttributeValueDTO[];
}

export class RequestGetAttributeValuesDTO {
  @Expose() @IsDefined() @IsString() attributeTypeKey!: string;
}
