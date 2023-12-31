import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, SentryTextService } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticUserService {
  constructor(private elasticService: ElasticService, private sentryTextService: SentryTextService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("users");
    if (!created) return "Can not create users elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("users", {
        clientId: { type: "keyword" },
        role: { type: "keyword" },
        name: { type: "text", fielddata: true },
        email: { type: "keyword" },
        position: { type: "text", fielddata: true },
        phone: { type: "keyword" },
      });
      return true;
    } catch (e) {
      return {
        message: "Can not create users elastic index mapping...",
        logBeautifulError: () =>
          this.sentryTextService.log(e as Error, {
            contextService: InitElasticUserService.name,
          }),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();
    if (isString(index)) {
      Logger.error(index, InitElasticUserService.name);
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, InitElasticUserService.name);
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
