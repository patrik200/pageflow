import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { GetDocumentIdElasticService } from "./get-id";

@Injectable()
export class DeleteDocumentsElasticService {
  constructor(private getIdService: GetDocumentIdElasticService, private elasticService: ElasticService) {}

  async elasticDeleteDocumentIndexOrFail(documentId: string) {
    await this.elasticService.deleteIndexDocumentOrFail(this.getIdService.getDocumentDocumentId(documentId));
  }
}
