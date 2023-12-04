import { StorageFileDTO } from "@app/back-kit";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsDate, withDefaultValue } from "@app/kit";
import { ProjectsStatus } from "@app/shared-enums";

import { ResponseProfileDTO } from "modules/users";
import { ResponseMinimalGoalDTO } from "modules/goals/dto/get/Goal";

export class ResponseMinimalProjectDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class ResponseProjectDTO extends ResponseMinimalProjectDTO {
  @Expose() @IsOptional() @IsString() description?: string;

  @Expose() @IsDefined() @IsNumber() updateCount!: number;

  @Expose() @IsOptional() @Type(() => ResponseProfileDTO) @ValidateNested() responsible?: ResponseProfileDTO;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsOptional() @Type(() => StorageFileDTO) @ValidateNested() preview?: StorageFileDTO;

  @Expose() @IsDefined() @IsEnum(ProjectsStatus) status!: ProjectsStatus;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) canMoveToCompletedStatus!: boolean;

  @Expose() @IsOptional() @IsDate() startDatePlan?: Date;

  @Expose() @IsOptional() @IsDate() startDateForecast?: Date;

  @Expose() @IsOptional() @IsDate() startDateFact?: Date;

  @Expose() @IsOptional() @IsDate() endDatePlan?: Date;

  @Expose() @IsOptional() @IsDate() endDateForecast?: Date;

  @Expose() @IsOptional() @IsDate() endDateFact?: Date;

  @Expose() @IsOptional() @IsNumber() notifyInDays?: number;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose() @IsOptional() @IsNumber() @withDefaultValue(0) activeTicketsCount!: number;

  @Expose()
  @IsDefined()
  @Type(() => ResponseMinimalGoalDTO)
  @ValidateNested({ each: true })
  @withDefaultValue([])
  goals!: ResponseMinimalGoalDTO[];
}

export class ResponseProjectsListDTO {
  @Expose() @IsDefined() @Type(() => ResponseProjectDTO) @ValidateNested({ each: true }) list!: ResponseProjectDTO[];
}
