import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsDate, withDefaultValue } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";
import { ResponsePermissionDTO } from "modules/permissions";

export class ResponseMinimalCorrespondenceGroupDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class ResponseCorrespondenceGroupDTO extends ResponseMinimalCorrespondenceGroupDTO {
  @Expose() @IsOptional() @IsString() description?: string;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => ResponsePermissionDTO)
  @ValidateNested({ each: true })
  permissions?: ResponsePermissionDTO[];
}

export class ResponseCorrespondenceGroupsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceGroupDTO)
  @ValidateNested({ each: true })
  list!: ResponseCorrespondenceGroupDTO[];
}
