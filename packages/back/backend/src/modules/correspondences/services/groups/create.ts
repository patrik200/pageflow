import { PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";
import { CreatePermissionService } from "modules/permissions";
import { GetProjectService } from "modules/projects";
import { GetDocumentService } from "modules/documents";

import { CreateCorrespondenceGroupElasticService } from "./elastic";
import { GetCorrespondenceGroupService } from "./get";
import { GetCorrespondenceRootGroupService } from "./get-root";
import {
  CreateCorrespondenceInClientIdentifier,
  CreateCorrespondenceInDocumentIdentifier,
  CreateCorrespondenceInGroupIdentifier,
  CreateCorrespondenceInProjectIdentifier,
} from "../correspondences/create";

export interface CreateCorrespondenceGroupInterface {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export type CreateCorrespondenceGroupIdentifier =
  | CreateCorrespondenceInClientIdentifier
  | CreateCorrespondenceInProjectIdentifier
  | CreateCorrespondenceInDocumentIdentifier
  | CreateCorrespondenceInGroupIdentifier;

@Injectable()
export class CreateCorrespondenceGroupService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    private getCorrespondenceRootGroupService: GetCorrespondenceRootGroupService,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    private createCorrespondenceGroupElasticService: CreateCorrespondenceGroupElasticService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
  ) {}

  private async getIdentifierForCreateGroup(
    identifier: CreateCorrespondenceGroupIdentifier,
  ): Promise<DeepPartial<CorrespondenceGroupEntity>> {
    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getCorrespondenceGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });
      return { parentGroup: { id: parentGroup.id }, rootGroup: { id: parentGroup.rootGroup.id } };
    }

    if ("projectId" in identifier) {
      const parentProject = await this.getProjectService.getProjectOrFail(identifier.projectId, {
        loadCorrespondenceRootGroup: true,
      });
      return { rootGroup: { id: parentProject.correspondenceRootGroup.id } };
    }

    if ("documentId" in identifier) {
      // const parentDocument = await this.getDocumentService.getDocumentOrFail(identifier.documentId, {
      //   loadCorrespondenceRootGroup: true,
      // });
      // return { rootGroup: { id: parentDocument.correspondenceRootGroup.id } };
      throw new Error("not implemented");
    }

    const clientRootGroup = await this.getCorrespondenceRootGroupService.unsafeGetCorrespondenceRootGroupOrFail({});
    return { rootGroup: { id: clientRootGroup.id } };
  }

  @Transactional()
  async createGroupOrFail(identifier: CreateCorrespondenceGroupIdentifier, data: CreateCorrespondenceGroupInterface) {
    const resultIdentifier = await this.getIdentifierForCreateGroup(identifier);

    const currentUser = getCurrentUser();
    const savedGroup = await this.correspondenceGroupRepository.save({
      client: { id: currentUser.clientId },
      ...resultIdentifier,
      author: { id: currentUser.userId },
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate,
    });

    await this.createPermissionService.createPermissionOrFail(
      { entityId: savedGroup.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
      { userId: currentUser.userId, role: PermissionRole.OWNER },
      { validateCurrentUserPermissions: false },
    );

    const group = await this.correspondenceGroupRepository.findOneOrFail({ where: { id: savedGroup.id } });
    await group.recalculatePathAndSave(this.correspondenceGroupRepository);

    await this.createCorrespondenceGroupElasticService.elasticCreateGroupIndexOrFail(group.id);

    return group.id;
  }
}
