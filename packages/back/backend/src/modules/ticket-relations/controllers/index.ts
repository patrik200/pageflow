import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";

import { GetTicketRelationsService } from "../services/get";
import { EditTicketRelationsService } from "../services/edit-list";

import {
  RequestEditTicketRelationsForTicketDTO,
  ResponseEditTicketRelationsForTicketDTO,
} from "../dto/edit/CreateTicketRelation";
import { RequestTicketRelationsForTicketDTO, ResponseTicketRelationsForTicketDTO } from "../dto/get/Relations";

@Controller("tickets")
export class TicketRelationsController {
  constructor(
    private getTicketRelationsService: GetTicketRelationsService,
    private editTicketRelationsService: EditTicketRelationsService,
  ) {}

  @Get(":ticketId/relations")
  @withUserAuthorized([UserRole.USER])
  async getTicketRelationsForTicket(
    @Param("ticketId") ticketId: string,
    @Query() body: RequestTicketRelationsForTicketDTO,
  ) {
    const tickets = await this.getTicketRelationsService.getTicketRelationsOrFail(ticketId, {
      onlyAsMainRelated: body.onlyAsMainRelated,
    });

    return new ControllerResponse(ResponseTicketRelationsForTicketDTO, { list: tickets });
  }

  @Patch(":ticketId/relations")
  @withUserAuthorized([UserRole.USER])
  async editTicketRelationsForTicket(
    @Param("ticketId") ticketId: string,
    @Body() body: RequestEditTicketRelationsForTicketDTO,
  ) {
    const list = await this.editTicketRelationsService.editTicketRelationsOrFail(ticketId, body.list);

    return new ControllerResponse(ResponseEditTicketRelationsForTicketDTO, { list });
  }
}
