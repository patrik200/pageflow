import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsDate, withDefaultValue } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";
import { ResponseMinimalProjectDTO } from "modules/projects/dto/get/Project";
import { ResponsePermissionDTO } from "modules/permissions";

export class ResponseMinimalDocumentGroupDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;
}

export class ResponseDocumentGroupRootGroupDTO {
  @Expose({ name: "project", toPlainOnly: true })
  @IsDefined()
  @Type(() => ResponseMinimalProjectDTO)
  @ValidateNested()
  parentProject!: ResponseMinimalProjectDTO;
}

export class ResponseDocumentGroupDTO extends ResponseMinimalDocumentGroupDTO {
  @Expose() @IsOptional() @IsString() description?: string;

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose() @IsDefined() @IsBoolean() @withDefaultValue(false) favourite!: boolean;

  @Expose() @IsDefined() @IsBoolean() isPrivate!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => ResponseDocumentGroupRootGroupDTO)
  @ValidateNested()
  rootGroup!: ResponseDocumentGroupRootGroupDTO | null;

  @Expose()
  @IsOptional()
  @Type(() => ResponsePermissionDTO)
  @ValidateNested({ each: true })
  permissions?: ResponsePermissionDTO[];
}

export class ResponseDocumentGroupsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentGroupDTO)
  @ValidateNested({ each: true })
  list!: ResponseDocumentGroupDTO[];
}
