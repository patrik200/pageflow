import { IsDefined, IsString, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";

export class ResponseClientNotificationDTO {
  @Expose() @IsDefined() @IsString() text!: string;

  @Expose() @IsDefined() @IsString() type!: string;
}

export class ResponseClientNotificationsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseClientNotificationDTO)
  @ValidateNested({ each: true })
  list!: ResponseClientNotificationDTO[];
}
