import { IsDefined, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class RequestDeletePermissionDTO {
  @Expose() @IsDefined() @IsString() userId!: string;
}
