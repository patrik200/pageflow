import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class ResponseIdDTO {
  @Expose() @IsDefined() @IsString() id!: string;
}
