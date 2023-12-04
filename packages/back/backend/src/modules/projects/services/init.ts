import { ElasticService, errorLogBeautifier } from "@app/back-kit";
import { Injectable, Logger } from "@nestjs/common";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticProjectsService {
  constructor(private elasticService: ElasticService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("projects");
    if (!created) return "Can not create projects elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("projects", {
        status: { type: "keyword" },
        clientId: { type: "keyword" },
        authorId: { type: "keyword" },
        contractorId: { type: "keyword" },
        responsibleId: { type: "keyword" },
        name: { type: "text", fielddata: true },
        description: { type: "text" },
        startDatePlan: { type: "date" },
        startDateForecast: { type: "date" },
        startDateFact: { type: "date" },
        endDatePlan: { type: "date" },
        endDateForecast: { type: "date" },
        endDateFact: { type: "date" },
        isPrivate: { type: "boolean" },
      });
      return true;
    } catch (e) {
      return {
        message: "Can not create projects elastic index mapping...",
        logBeautifulError: () => errorLogBeautifier(e),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();
    if (isString(index)) {
      Logger.error(index, "Projects module bootstrap");
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, "Projects module bootstrap");
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
