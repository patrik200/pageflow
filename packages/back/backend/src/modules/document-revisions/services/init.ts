import { Injectable, Logger } from "@nestjs/common";
import { ElasticService, errorLogBeautifier } from "@app/back-kit";
import { isString } from "@worksolutions/utils";

@Injectable()
export class InitElasticDocumentRevisionsService {
  constructor(private elasticService: ElasticService) {}

  async createIndex() {
    const created = await this.elasticService.createIndexIfNotCreatedOrFail("document-revisions");
    if (!created) return "Can not create document revisions elastic index...";
    return true;
  }

  async createMapping() {
    try {
      await this.elasticService.setMappingOrFail("document-revisions", {
        clientId: { type: "keyword" },
        documentRootGroupId: { type: "keyword" },
        documentParentGroupIdsPath: { type: "text" },
        documentId: { type: "keyword" },
        number: { type: "keyword" },
        status: { type: "keyword" },
        ...this.elasticService.getAttachmentMapping("attachments"),
      });
      return true;
    } catch (e) {
      return {
        message: "Can not create document revisions elastic index mapping...",
        logBeautifulError: () => errorLogBeautifier(e),
      };
    }
  }

  async appBootstrap() {
    const index = await this.createIndex();
    if (isString(index)) {
      Logger.error(index, "Document revisions module bootstrap");
      process.exit(1);
    }

    const mapping = await this.createMapping();
    if (mapping !== true) {
      Logger.error(mapping.message, "Document revisions module bootstrap");
      mapping.logBeautifulError();
      process.exit(1);
    }
  }
}
