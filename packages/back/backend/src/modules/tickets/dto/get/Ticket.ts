import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TicketPriorities, TicketSortingFields } from "@app/shared-enums";
import { IsBooleanConverter, IsDate, IsSorting } from "@app/kit";
import type { Sorting } from "@app/kit";
import { ContainsStorageFilesDTO } from "@app/back-kit";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";

import { ResponseProfileDTO } from "modules/users";

export class RequestGetTicketsDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  boardId!: string;

  @Expose() @IsOptional() @IsString() search?: string;

  @Expose() @IsBooleanConverter() searchInAttachments!: boolean;

  @Expose() @IsOptional() @IsString() authorId?: string;

  @Expose() @IsOptional() @IsString() responsibleId?: string;

  @Expose() @IsOptional() @IsString() customerId?: string;

  @Expose() @IsOptional() @IsEnum(TicketPriorities) priority?: TicketPriorities;

  @Expose() @IsOptional() @IsString() typeKey?: string;

  @Expose() @IsOptional() @IsString() statusKey?: string;

  @Expose() @IsDefined() @IsSorting(Object.values(TicketSortingFields)) sorting!: Sorting<TicketSortingFields>;

  @Expose() @IsBooleanConverter() excludeArchived!: boolean;
}

export class ResponseMinimalTicketDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class ResponseTicketStatusDTO {
  @Expose() @IsDefined() @IsString() key!: string;
}

export class ResponseTicketTypeDTO {
  @Expose() @IsDefined() @IsString() key!: string;
}

export class ResponseTicketDTO extends ResponseMinimalTicketDTO {
  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsOptional() @IsDate() deadlineAt?: Date;

  @Expose() @IsOptional() @Type(() => ResponseProfileDTO) @ValidateNested() responsible?: ResponseProfileDTO;

  @Expose() @IsOptional() @Type(() => ResponseProfileDTO) @ValidateNested() customer?: ResponseProfileDTO;

  @Expose() @IsDefined() @IsEnum(TicketPriorities) priority!: TicketPriorities;

  @Expose() @IsOptional() @Type(() => ResponseTicketTypeDTO) @ValidateNested() type?: ResponseTicketTypeDTO;

  @Expose() @IsDefined() @Type(() => ResponseTicketStatusDTO) @ValidateNested() status!: ResponseTicketStatusDTO;

  @Expose() @IsDefined() @IsNumber() sort!: number;

  @Expose() @IsDefined() @IsBoolean() favourite!: boolean;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];
}

export class ResponseTicketsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseTicketDTO)
  @ValidateNested({ each: true })
  list!: ResponseTicketDTO[];
}

export class ResponseTicketDetailDTO extends ResponseTicketDTO {
  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsOptional() @IsString() description?: string;
}
