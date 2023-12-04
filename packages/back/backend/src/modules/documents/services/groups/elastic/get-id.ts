import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetDocumentGroupElasticService {
  constructor(private elasticService: ElasticService) {}

  getElasticGroupId(groupId: string) {
    return this.elasticService.getDocumentId("documents", groupId, "document-group");
  }
}
