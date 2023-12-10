import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class TimePoint {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @IsString() name!: string;

  @Expose() @IsDefined() @IsString() description!: string;
}
