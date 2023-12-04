import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";
import { StorageFileDTO } from "@app/back-kit";

export class ResponseContractorDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsOptional() @Type(() => StorageFileDTO) @ValidateNested() logo?: StorageFileDTO;
}

export class ResponseContractorsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseContractorDTO)
  @ValidateNested({ each: true })
  list!: ResponseContractorDTO[];
}
