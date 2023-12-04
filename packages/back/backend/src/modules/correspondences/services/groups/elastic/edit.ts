import { ElasticService, ElasticDocumentData } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { UpdateCorrespondenceGroupInterface } from "../edit";
import { GetCorrespondenceGroupIdElasticService } from "./get-id";

@Injectable()
export class EditCorrespondenceGroupElasticService {
  constructor(
    private getGroupIdService: GetCorrespondenceGroupIdElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticUpdateGroupIndexOrFail(groupId: string, data: UpdateCorrespondenceGroupInterface) {
    const updateData: ElasticDocumentData = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.isPrivate !== undefined) updateData.isPrivate = data.isPrivate;

    await this.elasticService.updateDocumentOrFail(this.getGroupIdService.getElasticGroupId(groupId), updateData);
  }
}
