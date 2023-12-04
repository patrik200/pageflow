import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { GetDocumentGroupElasticService } from "./get-id";

@Injectable()
export class DeleteDocumentGroupsElasticService {
  constructor(private getIdService: GetDocumentGroupElasticService, private elasticService: ElasticService) {}

  async elasticDeleteGroupIndexOrFail(groupId: string) {
    await this.elasticService.deleteIndexDocumentOrFail(this.getIdService.getElasticGroupId(groupId));
  }
}
