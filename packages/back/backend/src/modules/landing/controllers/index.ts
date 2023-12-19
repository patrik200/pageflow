import { Body, Controller, Get, Post } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";

import { megabyteToByte } from "utils/megabyteToByte";

import { CreateClientLandingService } from "../services/client/create";
import { GetTariffsLandingService } from "../services/tariffs/create";

import { RequestLandingClientDTO } from "../dto/RequestClient";
import { ResponseLandingTariffsListDTO } from "../dto/ResponseTariff";

@Controller("landing")
export class LandingController {
  constructor(
    private createClientLandingService: CreateClientLandingService,
    private getTariffsLandingService: GetTariffsLandingService,
  ) {}

  @Get("tariffs")
  async tariffs() {
    const tariffs = await this.getTariffsLandingService.getTariffs();
    return new ControllerResponse(ResponseLandingTariffsListDTO, { list: tariffs });
  }

  @Post("request")
  async landingRequest(@Body() body: RequestLandingClientDTO) {
    await this.createClientLandingService.createClientOrFail({
      domain: body.domain,
      companyName: body.companyName,
      name: body.name,
      email: body.email,
      filesMemoryLimitByte: megabyteToByte(150),
    });
  }
}
