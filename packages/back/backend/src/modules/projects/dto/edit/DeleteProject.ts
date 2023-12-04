import { Expose } from "class-transformer";
import { IsDefined, IsBoolean } from "class-validator";

export class RequestDeleteProjectDTO {
  @Expose()
  @IsDefined()
  @IsBoolean()
  moveDocuments!: boolean;

  @Expose()
  @IsDefined()
  @IsBoolean()
  moveCorrespondencesToClient!: boolean;
}
