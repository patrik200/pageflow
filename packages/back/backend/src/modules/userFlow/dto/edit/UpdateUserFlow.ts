import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, IsString, ValidateNested, IsBoolean, IsNumber } from "class-validator";
import { createClassValidatorErrorMessage } from "@app/back-kit";
import { ValidateBusiness_userFlow_deadlineDaysIncludeWeekends, withDefaultValue } from "@app/kit";
import { UserFlowMode } from "@app/shared-enums";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

const deadlineForWeekendsValidation = createClassValidatorErrorMessage({
  message: "Для учитывания выходных сроки должны быть указаны",
});

export class RequestUpdateUserFlowRowUserDTO {
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

export class RequestUpdateUserFlowRowDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose()
  @IsOptional()
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
  @Type(() => RequestUpdateUserFlowRowUserDTO)
  @IsOptional()
  @ValidateNested({ each: true })
  users!: RequestUpdateUserFlowRowUserDTO[];
}

export class RequestUpdateUserFlowDTO {
  @Expose() @IsOptional() @IsString({ message: dtoMessageIsValidValue }) name!: string;

  @Expose() @IsOptional() @IsString() reviewerId?: string | null;

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
  @Type(() => RequestUpdateUserFlowRowDTO)
  @IsOptional()
  @ValidateNested({ each: true })
  rows!: RequestUpdateUserFlowRowDTO[];
}
