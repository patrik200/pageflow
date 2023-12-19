import { Injectable, LoggerService } from "@nestjs/common";

import { Tariffs } from "fixtures/tariffs";

import { CreateClientService as CreateClientServiceBase } from "modules/clients";

@Injectable()
export class CreateClientCommand {
  constructor(private createClientService: CreateClientServiceBase) {}

  async run(data: { name: string; domain: string }, logger: LoggerService = console) {
    try {
      const clientId = await this.createClientService.createClientOrFail({
        name: data.name,
        domain: data.domain,
        tariff: Tariffs.ON_PREMISE,
        filesMemoryLimitByte: null,
      });
      logger.log(`Client "${data.name}" created. ID = "${clientId}"`, "Create client command");
    } catch (e) {
      logger.error(e);
      return;
    }
  }
}
