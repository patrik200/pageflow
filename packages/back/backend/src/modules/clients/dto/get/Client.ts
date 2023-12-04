import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { StorageFileDTO } from "@app/back-kit";

export class ResponseClientDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() domain!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @Type(() => StorageFileDTO) @ValidateNested() logo?: StorageFileDTO;
}
