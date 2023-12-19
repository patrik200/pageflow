import { IsBooleanConverter } from "@app/kit";
import { TicketRelationTypes } from "@app/shared-enums";
import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";

import { ResponseMinimalTicketDTO } from "modules/tickets/dto/get/Ticket";

export class RequestTicketRelationsForTicketDTO {
  @Expose() @IsBooleanConverter() onlyAsMainRelated!: boolean;
}

export class ResponseTicketRelationDTO {
  @Expose() @IsDefined() @IsString() id!: string;

  @Expose() @IsDefined() @Type(() => ResponseMinimalTicketDTO) mainTicket!: ResponseMinimalTicketDTO;

  @Expose() @IsDefined() @Type(() => ResponseMinimalTicketDTO) relatedTicket!: ResponseMinimalTicketDTO;

  @Expose() @IsDefined() @IsEnum(TicketRelationTypes) type!: TicketRelationTypes;
}

export class ResponseTicketRelationsForTicketDTO {
  @Expose()
  @IsDefined()
  @Type(() => ResponseTicketRelationDTO)
  @ValidateNested({ each: true })
  list!: ResponseTicketRelationDTO[];
}
