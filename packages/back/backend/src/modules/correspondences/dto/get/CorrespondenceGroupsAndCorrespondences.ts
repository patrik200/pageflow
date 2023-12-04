import { Expose, Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";

import { ResponseCorrespondenceDTO } from "./Correspondence";
import { ResponseCorrespondenceGroupDTO, ResponseMinimalCorrespondenceGroupDTO } from "./CorrespondenceGroup";

export class ResponseCorrespondenceGroupsAndCorrespondencesDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseMinimalCorrespondenceGroupDTO)
  @ValidateNested({ each: true })
  groupsPath!: ResponseMinimalCorrespondenceGroupDTO[];

  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceGroupDTO)
  @ValidateNested({ each: true })
  correspondenceGroups!: ResponseCorrespondenceGroupDTO[];

  @Expose()
  @IsDefined()
  @Type(() => ResponseCorrespondenceDTO)
  @ValidateNested({ each: true })
  correspondences!: ResponseCorrespondenceDTO[];
}
