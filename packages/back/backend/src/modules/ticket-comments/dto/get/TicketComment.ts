import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { ContainsStorageFilesDTO } from "@app/back-kit";
import { IsDate } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";

export class ResponseTicketCommentDTO {
  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @IsBoolean() canUpdate!: boolean;

  @Expose() @IsDefined() @IsBoolean() updated!: boolean;

  @Expose()
  @IsOptional()
  @Type(() => ResponseTicketCommentDTO)
  @ValidateNested()
  answerFor?: ResponseTicketCommentDTO;

  @Expose()
  @IsDefined()
  @Type(() => ContainsStorageFilesDTO)
  @ValidateNested({ each: true })
  files!: ContainsStorageFilesDTO[];

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;
}

export class ResponseTicketCommentsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseTicketCommentDTO)
  @ValidateNested({ each: true })
  list!: ResponseTicketCommentDTO[];
}
