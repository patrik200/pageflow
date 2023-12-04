import { ElasticDocumentData, ElasticService } from "@app/back-kit";
import { CorrespondenceStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";

import { GetCorrespondenceIdElasticService } from "./get-id";

export interface UpdateCorrespondenceElasticInterface {
  name?: string;
  description?: string;
  contractorId?: string | null;
  status?: CorrespondenceStatus;
  isPrivate?: boolean;
  attributes?: { attributeTypeKey: string; value: string }[];
}

@Injectable()
export class EditCorrespondenceElasticService {
  constructor(private getIdService: GetCorrespondenceIdElasticService, private elasticService: ElasticService) {}

  async elasticUpdateCorrespondenceIndexOrFail(correspondenceId: string, data: UpdateCorrespondenceElasticInterface) {
    const updateOptions: ElasticDocumentData = {};

    if (data.name) updateOptions.name = data.name;
    if (data.description) updateOptions.description = data.description;
    if (data.status) updateOptions.status = data.status;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;
    if (data.attributes)
      updateOptions.attributes = data.attributes.map(({ attributeTypeKey, value }) => ({ attributeTypeKey, value }));

    await this.elasticService.updateDocumentOrFail(
      this.getIdService.getCorrespondenceDocumentId(correspondenceId),
      Object.assign(
        {},
        updateOptions,
        this.elasticService.updateNullOrUndefined<string>(data.contractorId, "contractorId"),
      ),
    );
  }
}
