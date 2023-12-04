import { Expose, Type } from "class-transformer";
import { IsDefined, IsString, ValidateNested } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

export class RequestAttributeForEntityDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  typeKey!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  value!: string;
}

export class ResponseAttributeValueTypeForEntityDTO {
  @Expose()
  @IsDefined()
  @IsString()
  key!: string;
}

export class ResponseAttributeValueForEntityDTO {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ResponseAttributeValueTypeForEntityDTO)
  attributeType!: ResponseAttributeValueTypeForEntityDTO;

  @Expose()
  @IsDefined()
  @IsString()
  value!: string;
}
