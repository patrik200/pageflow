import { Expose } from "class-transformer";
import { IsDefined, IsString } from "class-validator";

export class ResponseBuySubscriptionDTO {
  @Expose() @IsDefined() @IsString() confirmationUrl!: string;
}
