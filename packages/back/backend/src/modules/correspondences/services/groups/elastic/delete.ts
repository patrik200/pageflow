import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { GetCorrespondenceGroupIdElasticService } from "./get-id";

@Injectable()
export class DeleteCorrespondenceGroupElasticService {
  constructor(
    private getGroupIdService: GetCorrespondenceGroupIdElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticDeleteGroupIndexOrFail(groupId: string) {
    await this.elasticService.deleteIndexDocumentOrFail(this.getGroupIdService.getElasticGroupId(groupId));
  }
}
