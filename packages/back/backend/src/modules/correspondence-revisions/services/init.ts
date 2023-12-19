import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, SentryTextService } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticCorrespondenceRevisionService {
  constructor(private elasticService: ElasticService, private sentryTextService: SentryTextService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("correspondence-revisions");
    if (!created) return "Can not create correspondence revisions elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("correspondence-revisions", {
        clientId: { type: "keyword" },
        correspondenceRootGroupId: { type: "keyword" },
        correspondenceParentGroupIdsPath: { type: "text" },
        number: { type: "keyword" },
        status: { type: "keyword" },
        correspondenceId: { type: "keyword" },
        ...this.elasticService.getAttachmentMapping("attachments"),
      });
      return true;
    } catch (e) {
      return {
        message: "Can not create correspondence revision elastic index mapping...",
        logBeautifulError: () =>
          this.sentryTextService.log(e as Error, {
            contextService: InitElasticCorrespondenceRevisionService.name,
          }),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();
    if (isString(index)) {
      Logger.error(index, InitElasticCorrespondenceRevisionService.name);
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, InitElasticCorrespondenceRevisionService.name);
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
