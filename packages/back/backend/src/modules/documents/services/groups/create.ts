import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntityType, PermissionRole } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { getCurrentUser } from "modules/auth";
import { GetProjectService } from "modules/projects";
import { CreatePermissionService } from "modules/permissions";

import { CreateDocumentGroupsElasticService } from "./elastic";
import { GetDocumentGroupService } from "./get";
import { CreateDocumentInGroupIdentifier, CreateDocumentInProjectIdentifier } from "../documents/create";

export interface CreateDocumentGroupInterface {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export type CreateDocumentGroupIdentifier = CreateDocumentInProjectIdentifier | CreateDocumentInGroupIdentifier;

@Injectable()
export class CreateDocumentGroupService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private getDocumentGroupService: GetDocumentGroupService,
    private createDocumentGroupsElasticService: CreateDocumentGroupsElasticService,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  private async getIdentifierForCreateGroup(
    identifier: CreateDocumentGroupIdentifier,
  ): Promise<DeepPartial<DocumentGroupEntity>> {
    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getDocumentGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });
      return { parentGroup: { id: parentGroup.id }, rootGroup: { id: parentGroup.rootGroup.id } };
    }

    if ("projectId" in identifier) {
      const parentProject = await this.getProjectService.getProjectOrFail(identifier.projectId, {
        loadDocumentRootGroup: true,
      });
      return { rootGroup: { id: parentProject.documentRootGroup.id } };
    }

    throw new Error("unknown state");
  }

  @Transactional()
  async createGroupOrFail(identifierOptions: CreateDocumentGroupIdentifier, data: CreateDocumentGroupInterface) {
    const resultIdentifier = await this.getIdentifierForCreateGroup(identifierOptions);

    const currentUser = getCurrentUser();
    const savedGroup = await this.documentGroupRepository.save({
      ...resultIdentifier,
      author: { id: currentUser.userId },
      name: data.name,
      description: data.description,
      client: { id: currentUser.clientId },
      isPrivate: data.isPrivate,
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: savedGroup.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
      { userId: currentUser.userId, role: PermissionRole.OWNER },
      { validateCurrentUserPermissions: false },
    );

    const group = await this.documentGroupRepository.findOneOrFail({ where: { id: savedGroup.id } });
    await group.recalculatePathAndSave(this.documentGroupRepository);

    await this.createDocumentGroupsElasticService.elasticCreateGroupIndexOrFail(group.id);

    return group.id;
  }
}
