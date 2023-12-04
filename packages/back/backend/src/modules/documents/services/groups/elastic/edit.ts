import { ElasticService, ElasticDocumentData } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { UpdateDocumentGroupInterface } from "../edit";
import { GetDocumentGroupElasticService } from "./get-id";

@Injectable()
export class EditDocumentGroupsElasticService {
  constructor(private getIdService: GetDocumentGroupElasticService, private elasticService: ElasticService) {}

  async elasticUpdateGroupIndexOrFail(groupId: string, data: UpdateDocumentGroupInterface) {
    const updateOptions: ElasticDocumentData = {};

    if (data.name) updateOptions.name = data.name;
    if (data.description) updateOptions.description = data.description;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;

    await this.elasticService.updateDocumentOrFail(
      this.getIdService.getElasticGroupId(groupId),
      updateOptions as ElasticDocumentData,
    );
  }
}
