import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetCorrespondenceGroupIdElasticService {
  constructor(private elasticService: ElasticService) {}

  getElasticGroupId(groupId: string) {
    return this.elasticService.getDocumentId("correspondences", groupId, "correspondence-group");
  }
}
