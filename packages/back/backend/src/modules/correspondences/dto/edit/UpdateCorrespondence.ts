import { Expose, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

import { dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { RequestAttributeForEntityDTO } from "modules/attributes/dto/get-for-entity/Attributes";

export class RequestUpdateCorrespondenceDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  description?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: dtoMessageIsValidValue })
  contractorId?: string;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: dtoMessageIsValidValue })
  isPrivate?: boolean;

  @Expose()
  @IsOptional()
  @Type(() => RequestAttributeForEntityDTO)
  @ValidateNested({ each: true })
  attributes?: RequestAttributeForEntityDTO[];
}
