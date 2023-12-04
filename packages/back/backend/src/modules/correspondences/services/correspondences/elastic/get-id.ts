import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetCorrespondenceIdElasticService {
  constructor(private elasticService: ElasticService) {}

  getCorrespondenceDocumentId(correspondenceId: string) {
    return this.elasticService.getDocumentId("correspondences", correspondenceId, "correspondence");
  }
}
