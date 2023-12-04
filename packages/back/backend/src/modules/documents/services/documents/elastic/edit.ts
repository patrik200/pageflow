import { ElasticService, ElasticDocumentData } from "@app/back-kit";
import { DocumentStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";

import { DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { GetDocumentIdElasticService } from "./get-id";

export interface UpdateDocumentElasticInterface {
  name?: string;
  description?: string;
  remarks?: string;
  responsibleUserId?: string | null;
  responsibleUserFlowId?: string | null;
  typeKey?: string | null;
  contractorId?: string | null;
  startDatePlan?: Date | null;
  startDateForecast?: Date | null;
  startDateFact?: Date | null;
  endDatePlan?: Date | null;
  endDateForecast?: Date | null;
  endDateFact?: Date | null;
  isPrivate?: boolean;
  attributes?: { attributeTypeKey: string; value: string }[];
}

@Injectable()
export class EditDocumentsElasticService {
  constructor(private getIdService: GetDocumentIdElasticService, private elasticService: ElasticService) {}

  async elasticUpdateDocumentIndexOrFail(
    documentId: string,
    data: UpdateDocumentElasticInterface,
    type: DictionaryValueEntity | null | undefined,
  ) {
    const updateOptions: ElasticDocumentData = {};

    if (data.name) updateOptions.name = data.name;
    if (data.description) updateOptions.description = data.description;
    if (data.remarks) updateOptions.remarks = data.remarks;
    if (data.startDatePlan) updateOptions.startDatePlan = data.startDatePlan;
    if (data.startDateForecast) updateOptions.startDateForecast = data.startDateForecast;
    if (data.startDateFact) updateOptions.startDateFact = data.startDateFact;
    if (data.endDatePlan) updateOptions.endDatePlan = data.endDatePlan;
    if (data.endDateForecast) updateOptions.endDateForecast = data.endDateForecast;
    if (data.endDateFact) updateOptions.startDateFact = data.endDateFact;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;
    if (data.attributes)
      updateOptions.attributes = data.attributes.map(({ attributeTypeKey, value }) => ({ attributeTypeKey, value }));

    await this.elasticService.updateDocumentOrFail(
      this.getIdService.getDocumentDocumentId(documentId),
      Object.assign(
        {},
        updateOptions,
        this.elasticService.updateNullOrUndefined<string>(data.responsibleUserId, "responsibleUserId"),
        this.elasticService.updateNullOrUndefined<string>(data.responsibleUserFlowId, "responsibleUserFlowId"),
        this.elasticService.updateNullOrUndefined<string>(data.typeKey, "type", type?.id),
        // this.elasticService.updateNullOrUndefined<string>(data.contractorId, "contractorId"),
      ),
    );
  }

  async elasticUpdateDocumentStatusIndexOrFail(documentId: string, newStatus: DocumentStatus) {
    await this.elasticService.updateDocumentOrFail(this.getIdService.getDocumentDocumentId(documentId), {
      status: newStatus,
    });
  }
}
