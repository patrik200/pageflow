import { IsBoolean, IsDefined, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { IsDate } from "@app/kit";
import { ContainsStorageFilesDTO } from "@app/back-kit";

import { ResponseProfileDTO } from "modules/users";

export class ResponseDocumentRevisionCommentDiscussionDTO {
  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose() @IsDefined() @IsBoolean() updated!: boolean;

  @Expose() @IsDefined() @IsBoolean() canUpdate!: boolean;
}

export class ResponseDocumentRevisionCommentDiscussionsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentRevisionCommentDiscussionDTO)
  @ValidateNested({ each: true })
  items!: ResponseDocumentRevisionCommentDiscussionDTO[];
}
