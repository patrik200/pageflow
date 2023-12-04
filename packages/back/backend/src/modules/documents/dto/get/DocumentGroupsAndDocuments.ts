import { IsDefined, IsOptional, ValidateNested } from "class-validator";
import { withDefaultValue } from "@app/kit";
import { Expose, Type } from "class-transformer";

import { ResponseDocumentDTO } from "./Document";
import { ResponseDocumentGroupDTO, ResponseMinimalDocumentGroupDTO } from "./DocumentGroup";

export class ResponseDocumentGroupAndDocumentsDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseMinimalDocumentGroupDTO)
  @ValidateNested({ each: true })
  groupsPath!: ResponseMinimalDocumentGroupDTO[];

  @Expose()
  @IsDefined()
  @Type(() => ResponseDocumentGroupDTO)
  @ValidateNested({ each: true })
  documentGroups!: ResponseDocumentGroupDTO[];

  @Expose()
  @IsOptional()
  @withDefaultValue([])
  @Type(() => ResponseDocumentDTO)
  @ValidateNested({ each: true })
  documents!: ResponseDocumentDTO[];
}
