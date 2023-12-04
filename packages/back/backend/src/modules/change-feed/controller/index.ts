import { Controller, Get, Param, ParseEnumPipe } from "@nestjs/common";
import { ChangeFeedEntityType, UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";

import { GetChangeFeedEventsService } from "../services/get-feed-events";

import { ResponseChangeFeedEventsListDTO } from "../dto/ChangeFeedEvent";

@Controller("change-feed")
export class ChangeFeedController {
  constructor(private getChangeFeedEventsService: GetChangeFeedEventsService) {}

  @Get(":entityType/:entityId")
  @withUserAuthorized([UserRole.USER])
  async getChangeFeedEvents(
    @Param("entityType", new ParseEnumPipe(ChangeFeedEntityType)) entityType: ChangeFeedEntityType,
    @Param("entityId") entityId: string,
  ) {
    const list = await this.getChangeFeedEventsService.getChangeFeedEvents({ entityType, entityId });
    return new ControllerResponse(ResponseChangeFeedEventsListDTO, { list });
  }
}
