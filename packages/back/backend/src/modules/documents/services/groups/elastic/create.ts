import { ElasticService, ElasticDocumentData } from "@app/back-kit";
import { DocumentStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { GetDocumentGroupElasticService } from "./get-id";

@Injectable()
export class CreateDocumentGroupsElasticService {
  constructor(
    @InjectRepository(DocumentGroupEntity)
    private groupsRepository: Repository<DocumentGroupEntity>,
    private getIdService: GetDocumentGroupElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateGroupIndexOrFail(groupId: string, refreshIndex?: boolean) {
    const group = await this.groupsRepository.findOneOrFail({
      where: { id: groupId },
      relations: { parentGroup: true, rootGroup: true, client: true, author: true },
    });

    if (!group.rootGroup) return;

    await this.elasticService.addDocumentOrFail(
      this.getIdService.getElasticGroupId(group.id),
      {
        objectType: "document-group",
        clientId: group.client.id,
        parentGroupId: group.parentGroup?.id ?? null,
        parentGroupIdsPath: this.elasticService.getHierarchyPath(group.parentGroup?.path),
        rootGroupId: group.rootGroup.id,
        authorId: group.author.id,
        name: group.name,
        description: group.description ?? "",
        status: DocumentStatus.ACTIVE,
        isPrivate: group.isPrivate,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      } as ElasticDocumentData,
      refreshIndex,
    );
  }
}
