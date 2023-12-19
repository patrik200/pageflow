import { TicketRelationTypes } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";

import { dtoMessageIsDefined, dtoMessageIsValidValue } from "constants/dtoErrorMessage";
import { ResponseIdDTO } from "constants/ResponseId";

export class RequestCreateTicketRelationDTO {
  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsString({ message: dtoMessageIsValidValue })
  relatedTicketId!: string;

  @Expose()
  @IsDefined({ message: dtoMessageIsDefined })
  @IsEnum(TicketRelationTypes, { message: dtoMessageIsValidValue })
  type!: TicketRelationTypes;
}

export class RequestEditTicketRelationsForTicketDTO {
  @Expose()
  @IsDefined()
  @Type(() => RequestCreateTicketRelationDTO)
  @ValidateNested({ each: true })
  list!: RequestCreateTicketRelationDTO[];
}

export class ResponseEditTicketRelationsForTicketDTO {
  @Expose() @IsDefined() @Type(() => ResponseIdDTO) @ValidateNested({ each: true }) list!: ResponseIdDTO[];
}
