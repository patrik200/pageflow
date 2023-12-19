import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, SentryTextService } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticDocumentGroupsAndDocumentsService {
  constructor(private elasticService: ElasticService, private sentryTextService: SentryTextService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("documents");
    if (!created) return "Can not create documents elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("documents", {
        objectType: { type: "keyword" },
        clientId: { type: "keyword" },
        parentGroupId: { type: "keyword" },
        parentGroupIdsPath: { type: "text" },
        rootGroupId: { type: "keyword" },
        authorId: { type: "keyword" },
        status: { type: "keyword" },
        name: { type: "text", fielddata: true },
        description: { type: "text" },
        remarks: { type: "text" },
        responsibleUserId: { type: "keyword" },
        responsibleUserFlowId: { type: "keyword" },
        typeId: { type: "keyword" },
        contractorId: { type: "keyword" },
        startDatePlan: { type: "date" },
        startDateForecast: { type: "date" },
        startDateFact: { type: "date" },
        endDatePlan: { type: "date" },
        endDateForecast: { type: "date" },
        endDateFact: { type: "date" },
        lastRevisionStatus: { type: "keyword" },
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
        message: "Can not create documents elastic index mapping...",
        logBeautifulError: () =>
          this.sentryTextService.log(e as Error, {
            contextService: InitElasticDocumentGroupsAndDocumentsService.name,
          }),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();

    if (isString(index)) {
      Logger.error(index, InitElasticDocumentGroupsAndDocumentsService.name);
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, InitElasticDocumentGroupsAndDocumentsService.name);
      mapping.logBeautifulError();
      process.exit(1);
    }
  }

  async createUniversalIngestAttachmentProcessorPipeline() {
    await this.elasticService.createAttachmentProcessorIfNotCreatedOrFail("attachments");
  }
}
