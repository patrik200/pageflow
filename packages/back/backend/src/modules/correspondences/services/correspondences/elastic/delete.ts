import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { GetCorrespondenceIdElasticService } from "./get-id";

@Injectable()
export class DeleteCorrespondenceElasticService {
  constructor(private getIdService: GetCorrespondenceIdElasticService, private elasticService: ElasticService) {}

  async elasticDeleteCorrespondenceIndexOrFail(correspondenceId: string) {
    await this.elasticService.deleteIndexDocumentOrFail(
      this.getIdService.getCorrespondenceDocumentId(correspondenceId),
    );
  }
}
