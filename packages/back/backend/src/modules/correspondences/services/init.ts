import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, SentryTextService } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticCorrespondenceAndGroupService {
  constructor(private elasticService: ElasticService, private sentryTextService: SentryTextService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("correspondences");
    if (!created) return "Can not create correspondents elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("correspondences", {
        objectType: { type: "keyword" },
        authorId: { type: "keyword" },
        parentGroupId: { type: "keyword" },
        parentGroupIdsPath: { type: "text" },
        rootGroupId: { type: "keyword" },
        contractorId: { type: "keyword" },
        clientId: { type: "keyword" },
        status: { type: "keyword" },
        name: { type: "text", fielddata: true },
        description: { type: "text" },
        isPrivate: { type: "boolean" },
        attributes: {
          type: "nested",
          properties: {
            attributeTypeKey: { type: "text" },
            value: { type: "text" },
          },
        },
        createdAt: { type: "date" },
        updatedAt: { type: "date" },
      });

      return true;
    } catch (e) {
      return {
        message: "Can not create Correspondence elastic index mapping...",
        logBeautifulError: () =>
          this.sentryTextService.log(e as Error, {
            contextService: InitElasticCorrespondenceAndGroupService.name,
          }),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();

    if (isString(index)) {
      Logger.error(index, InitElasticCorrespondenceAndGroupService.name);
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, InitElasticCorrespondenceAndGroupService.name);
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
