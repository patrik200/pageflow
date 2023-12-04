import { Expose, Type } from "class-transformer";
import { IsDefined, IsOptional, IsEnum, IsString, ValidateNested, IsBoolean, IsNumber } from "class-validator";
import { ValidateBusiness_userFlow_deadlineDaysIncludeWeekends, withDefaultValue } from "@app/kit";
import { createClassValidatorErrorMessage } from "@app/back-kit";
import { UserFlowMode } from "@app/shared-enums";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

const deadlineForWeekendsValidation = createClassValidatorErrorMessage({
  message: "Для учитывания выходных сроки должны быть указаны",
});

export class RequestCreateUserFlowRowUserDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  id!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  description!: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @withDefaultValue(null)
  deadlineDaysAmount!: number | null;
}

export class RequestCreateUserFlowRowDTO {
  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEnum(UserFlowMode, { message: dtoMessageIsValidValue })
  mode!: UserFlowMode;

  @Expose()
  @IsOptional()
  @IsNumber()
  @withDefaultValue(null)
  deadlineDaysAmount!: number | null;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsBoolean()
  forbidNextRowsApproving!: boolean;

  @Expose()
  @Type(() => RequestCreateUserFlowRowUserDTO)
  @IsDefined({ message: dtoMessageIsDefined })
  @ValidateNested({ each: true })
  users!: RequestCreateUserFlowRowUserDTO[];
}

export class RequestCreateUserFlowDTO {
  @Expose() @IsDefined({ message: dtoMessageIsDefined }) @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose() @IsOptional() @IsString() reviewerId!: string | undefined;

  @Expose()
  @IsOptional()
  @IsNumber()
  @withDefaultValue(null)
  deadlineDaysAmount!: number | null;

  @Expose()
  @IsDefined()
  @ValidateBusiness_userFlow_deadlineDaysIncludeWeekends({ message: deadlineForWeekendsValidation })
  deadlineDaysIncludeWeekends!: boolean;

  @Expose()
  @Type(() => RequestCreateUserFlowRowDTO)
  @IsDefined({ message: dtoMessageIsDefined })
  @ValidateNested({ each: true })
  rows!: RequestCreateUserFlowRowDTO[];
}
