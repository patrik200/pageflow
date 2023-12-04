import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetDocumentIdElasticService {
  constructor(private elasticService: ElasticService) {}

  getDocumentDocumentId(documentId: string) {
    return this.elasticService.getDocumentId("documents", documentId, "document");
  }
}
