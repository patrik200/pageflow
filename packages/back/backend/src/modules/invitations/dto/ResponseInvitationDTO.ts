import { IsString, IsNumber } from "class-validator";
import { Expose } from "class-transformer";

import { RequestCreateInvitationDTO } from "./createInvitation";

export class ResponseInvitationDTO extends RequestCreateInvitationDTO {
  @Expose()
  @IsNumber()
  iat!: number;

  @Expose()
  @IsNumber()
  exp!: number;

  @Expose()
  @IsString()
  clientId!: string;
}
