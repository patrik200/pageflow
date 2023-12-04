import { Injectable, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClientEntity } from "entities/Client";

@Injectable()
export class ReadOnlyModeCommand {
  constructor(@InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>) {}

  async run(mode: string, logger: LoggerService = console) {
    if (mode !== "enable-readonly" && mode !== "disable-readonly") {
      logger.error(`Invalid mode '${mode}'`, "Change client read only mode");
      return;
    }

    try {
      await this.clientRepository.update(
        {},
        {
          readOnlyMode: mode === "enable-readonly",
        },
      );

      logger.log(`Run ${mode} for all clients success`, "Change client read only mode");
    } catch (e) {
      logger.error(e);
      return;
    }
  }
}
