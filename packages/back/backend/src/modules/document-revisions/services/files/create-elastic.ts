import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateDocumentRevisionFilesElasticService {
  constructor(private elasticService: ElasticService) {}

  async elasticAddRevisionAttachment(
    revisionId: string,
    file: { entity: { id: string; fileName: string }; buffer: Buffer },
    options: { refreshIndex?: boolean; waitForIndex?: boolean } = {},
  ) {
    const documentId = this.elasticService.getDocumentId("document-revisions", revisionId);

    await this.elasticService.addDocumentAttachmentOrFail(
      documentId,
      "attachments",
      {
        data: file.buffer,
        id: file.entity.id,
        fileName: file.entity.fileName,
      },
      options,
    );
  }
}
