import { Controller, Get } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";

import { GetStatisticsService } from "../services/get";

import { ResponseStatisticsDTO } from "../dto/ChangeFeedEvent";

@Controller("statistics")
export class StatisticsController {
  constructor(private getStatisticsService: GetStatisticsService) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getStatistics() {
    const statistics = await this.getStatisticsService.getStatisticsOrFail();
    return new ControllerResponse(ResponseStatisticsDTO, statistics);
  }
}
