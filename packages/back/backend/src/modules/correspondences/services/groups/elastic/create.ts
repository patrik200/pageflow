import { ElasticService, ElasticDocumentData } from "@app/back-kit";
import { CorrespondenceStatus } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { GetCorrespondenceGroupIdElasticService } from "./get-id";

@Injectable()
export class CreateCorrespondenceGroupElasticService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private groupRepository: Repository<CorrespondenceGroupEntity>,
    private getIdService: GetCorrespondenceGroupIdElasticService,
    private elasticService: ElasticService,
  ) {}

  async elasticCreateGroupIndexOrFail(groupId: string, refreshIndex?: boolean) {
    const group = await this.groupRepository.findOneOrFail({
      where: { id: groupId },
      relations: { parentGroup: true, rootGroup: true, author: true, client: true },
    });

    if (!group.rootGroup) return;

    await this.elasticService.addDocumentOrFail(
      this.getIdService.getElasticGroupId(group.id),
      {
        objectType: "correspondence-group",
        authorId: group.author.id,
        clientId: group.client.id,
        parentGroupId: group.parentGroup?.id ?? null,
        parentGroupIdsPath: this.elasticService.getHierarchyPath(group.parentGroup?.path),
        rootGroupId: group.rootGroup.id,
        name: group.name,
        description: group.description ?? undefined,
        status: CorrespondenceStatus.ACTIVE,
        isPrivate: group.isPrivate,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      } as ElasticDocumentData,
      refreshIndex,
    );
  }
}
