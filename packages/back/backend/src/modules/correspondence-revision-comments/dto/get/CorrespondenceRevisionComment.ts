import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsString, ValidateNested } from "class-validator";
import { IsDate } from "@app/kit";
import { ContainsStorageFilesDTO } from "@app/back-kit";

import { ResponseProfileDTO } from "modules/users";

export class ResponseCorrespondenceRevisionCommentDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @IsBoolean() updated!: boolean;

  @Expose() @IsDefined() @IsBoolean() canUpdate!: boolean;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsDate() updatedAt!: Date;
}

export class ResponseCorrespondenceRevisionCommentListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceRevisionCommentDTO)
  @ValidateNested({ each: true })
  items!: ResponseCorrespondenceRevisionCommentDTO[];
}
