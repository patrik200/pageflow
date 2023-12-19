import { Expose, Transform, Type } from "class-transformer";
import { IsDefined, IsNumber, IsString, ValidateNested, IsBoolean } from "class-validator";

export class StorageFileDTO {
  @Expose() @IsDefined() @IsString() id!: string;
  @Expose() @IsDefined() @IsString() bucket!: string;
  @Expose() @IsDefined() @IsString() fileName!: string;
  @Expose() @IsDefined() @IsNumber() size!: number;
  @Expose() @IsDefined() @IsBoolean() public!: boolean;
}

export class ContainsStorageFilesDTO {
  @Type(() => StorageFileDTO) @IsDefined() @ValidateNested() file!: StorageFileDTO;
  @Expose() @Transform(({ obj }) => obj.file.id) id!: string;
  @Expose() @Transform(({ obj }) => obj.file.bucket) bucket!: string;
  @Expose() @Transform(({ obj }) => obj.file.fileName) fileName!: string;
  @Expose() @Transform(({ obj }) => obj.file.size) size!: string;
  @Expose() @Transform(({ obj }) => obj.file.public) public!: boolean;
}
