import { Expose, Transform, Type } from "class-transformer";
import { IsDefined, IsString, ValidateNested } from "class-validator";
import { IsDate } from "@app/kit";

import { ResponseProfileDTO } from "modules/users";

export class ResponseChangeFeedEventDTO {
  @Expose() @IsDefined() @IsDate() createdAt!: Date;

  @Expose() @IsDefined() @Type(() => ResponseProfileDTO) @ValidateNested() author!: ResponseProfileDTO;

  @Expose()
  @IsDefined()
  @IsString()
  eventType!: string;

  @Expose()
  @IsDefined()
  @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
  data!: string;
}

export class ResponseChangeFeedEventsListDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseChangeFeedEventDTO)
  @ValidateNested({ each: true })
  list!: ResponseChangeFeedEventDTO[];
}
