import { ElasticDocumentData, ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { GetCorrespondenceIdElasticService } from "./get-id";

@Injectable()
export class CreateCorrespondenceElasticService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getIdService: GetCorrespondenceIdElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateCorrespondenceIndexOrFail(correspondenceId: string, refreshIndex?: boolean) {
    const correspondence = await this.correspondenceRepository.findOneOrFail({
      where: { id: correspondenceId },
      relations: {
        author: true,
        contractor: true,
        rootGroup: { client: true },
        parentGroup: true,
        attributeValues: { attributeType: true },
      },
    });

    const attributes = correspondence.attributeValues.map(({ value, attributeType }) => ({
      value,
      attributeTypeKey: attributeType.key,
    }));

    await this.elasticService.addDocumentOrFail(
      this.getIdService.getCorrespondenceDocumentId(correspondenceId),
      {
        objectType: "correspondence",
        authorId: correspondence.author.id,
        clientId: correspondence.rootGroup.client.id,
        parentGroupId: correspondence.parentGroup?.id ?? null,
        parentGroupIdsPath: this.elasticService.getHierarchyPath(correspondence.parentGroup?.path),
        rootGroupId: correspondence.rootGroup.id,
        contractorId: correspondence.contractor?.id,
        status: correspondence.status,
        name: correspondence.name,
        description: correspondence.description ?? undefined,
        isPrivate: correspondence.isPrivate,
        attributes,
        createdAt: correspondence.createdAt,
        updatedAt: correspondence.updatedAt,
      } as ElasticDocumentData,
      refreshIndex,
    );
  }
}
