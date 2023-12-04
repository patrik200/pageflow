import {
  addTypeOrmFindRelationsToQueryBuilder,
  ElasticDocumentData,
  ElasticService,
  typeormAlias,
} from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { GetDocumentIdElasticService } from "./get-id";

@Injectable()
export class CreateDocumentsElasticService {
  constructor(
    @InjectRepository(DocumentEntity) private documentsRepository: Repository<DocumentEntity>,
    private getIdService: GetDocumentIdElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateDocumentIndexOrFail(documentId: string, refreshIndex?: boolean) {
    const documentQB = this.documentsRepository.createQueryBuilder(typeormAlias).where({ id: documentId });

    documentQB
      .leftJoin(
        (subQuery) =>
          subQuery
            .from(DocumentRevisionEntity, "revision")
            .select("MAX(revision.createdAt)")
            .addSelect("revision.documentId", "documentId")
            .addSelect("revision.status", "status")
            .groupBy("revision.documentId, revision.status"),
        "lastRevision",
        `${typeormAlias}.id = "lastRevision"."documentId"`,
      )
      .addSelect('"lastRevision"."status"', `${typeormAlias}_lastRevisionStatus`);

    addTypeOrmFindRelationsToQueryBuilder(documentQB, [
      "parentGroup",
      "rootGroup",
      "author",
      "responsibleUser",
      "responsibleUserFlow",
      "contractor",
      "type",
      "client",
      "attributeValues",
      "attributeValues.attributeType",
    ]);

    const document = await documentQB.getOneOrFail();

    const attributes = document.attributeValues.map(({ value, attributeType }) => ({
      value,
      attributeTypeKey: attributeType.key,
    }));

    await this.elasticService.addDocumentOrFail(
      this.getIdService.getDocumentDocumentId(document.id),
      {
        objectType: "document",
        clientId: document.client.id,
        parentGroupId: document.parentGroup?.id ?? null,
        parentGroupIdsPath: this.elasticService.getHierarchyPath(document.parentGroup?.path),
        rootGroupId: document.rootGroup.id,
        authorId: document.author.id,
        status: document.status,
        name: document.name,
        description: document.description ?? "",
        remarks: document.remarks ?? "",
        responsibleUserId: document.responsibleUser?.id,
        responsibleUserFlowId: document.responsibleUserFlow?.id,
        typeId: document.type?.id,
        contractorId: document.contractor?.id,
        startDatePlan: document.startDatePlan?.toISOString(),
        startDateForecast: document.startDateForecast?.toISOString(),
        startDateFact: document.startDateFact?.toISOString(),
        endDatePlan: document.endDatePlan?.toISOString(),
        endDateForecast: document.endDateForecast?.toISOString(),
        endDateFact: document.endDateFact?.toISOString(),
        lastRevisionStatus: document.lastRevisionStatus,
        isPrivate: document.isPrivate,
        attributes,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      } as ElasticDocumentData,
      refreshIndex,
    );
  }
}
