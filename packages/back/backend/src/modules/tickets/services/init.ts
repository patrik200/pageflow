import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, SentryTextService } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticTicketService {
  constructor(private elasticService: ElasticService, private sentryTextService: SentryTextService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("tickets");
    if (!created) return "Can not create tickets elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("tickets", {
        clientId: { type: "keyword" },
        boardId: { type: "keyword" },
        name: { type: "text", fielddata: true },
        slug: { type: "text", fielddata: true },
        description: { type: "text", fielddata: true },
        priority: { type: "integer" },
        statusId: { type: "keyword" },
        typeId: { type: "keyword" },
        authorId: { type: "keyword" },
        customerId: { type: "keyword" },
        responsibleId: { type: "keyword" },
        deadlineAt: { type: "date" },
        createdAt: { type: "date" },
        ...this.elasticService.getAttachmentMapping("attachments"),
      });

      return true;
    } catch (e) {
      return {
        message: "Can not create tickets elastic index mapping...",
        logBeautifulError: () =>
          this.sentryTextService.log(e as Error, {
            contextService: InitElasticTicketService.name,
          }),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();

    if (isString(index)) {
      Logger.error(index, InitElasticTicketService);
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, InitElasticTicketService);
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
