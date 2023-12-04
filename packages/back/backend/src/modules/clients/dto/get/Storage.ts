import { IsBoolean, IsDefined, IsInt } from "class-validator";
import { Expose } from "class-transformer";

export class ResponseStorageUsageInfoDTO {
  @Expose() @IsDefined() @IsInt() usedFileSize!: number;

  @Expose() @IsDefined() @IsInt() filesMemoryLimit!: number;

  @Expose() @IsDefined() @IsBoolean() haveFilesMemoryLimit!: boolean;
}
