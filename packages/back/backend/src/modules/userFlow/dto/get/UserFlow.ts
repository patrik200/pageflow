import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, ValidateNested, IsNumber } from "class-validator";
import { UserFlowMode } from "@app/shared-enums";
import { withDefaultValue } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";

export class ResponseUserFlowRowUserDTO {
  @Expose() @IsDefined() @IsString() description!: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  deadlineDaysAmount!: number | null;

  @Expose()
  @IsDefined()
  @Type(() => ResponseProfileDTO)
  @ValidateNested()
  user!: ResponseProfileDTO;
}

export class ResponseUserFlowRowDTO {
  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsEnum(UserFlowMode) mode!: UserFlowMode;

  @Expose()
  @IsOptional()
  @IsNumber()
  deadlineDaysAmount!: number | null;

  @Expose() @IsDefined() @IsBoolean() forbidNextRowsApproving!: boolean;

  @Expose()
  @IsDefined()
  @Type(() => ResponseUserFlowRowUserDTO)
  @ValidateNested({ each: true })
  users!: ResponseUserFlowRowUserDTO[];
}

export class ResponseUserFlowReviewerDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseProfileDTO)
  @ValidateNested()
  user!: ResponseProfileDTO;
}

export class ResponseUserFlowDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  deadlineDaysAmount!: number | null;

  @Expose() @IsDefined() @IsBoolean() deadlineDaysIncludeWeekends!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => ResponseUserFlowReviewerDTO)
  @ValidateNested()
  reviewer?: ResponseUserFlowReviewerDTO;

  @Expose() @IsOptional() @IsBoolean() @withDefaultValue(false) canUpdate!: boolean;

  @Expose()
  @IsDefined()
  @Type(() => ResponseUserFlowRowDTO)
  @ValidateNested({ each: true })
  rows!: ResponseUserFlowRowDTO[];
}

export class ResponseUserFlowListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseUserFlowDTO)
  @ValidateNested({ each: true })
  list!: ResponseUserFlowDTO[];
}
