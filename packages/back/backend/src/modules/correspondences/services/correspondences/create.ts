import { AttributeCategory, CorrespondenceStatus, PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { getCurrentUser } from "modules/auth";
import { CreatePermissionService, PermissionAccessService } from "modules/permissions";
import { GetProjectService } from "modules/projects";
import { UpdatableAttributeInterface, UpdateAttributesService } from "modules/attributes";

import { GetCorrespondenceGroupService } from "../groups/get";
import { GetCorrespondenceRootGroupService } from "../groups/get-root";
import { CreateCorrespondenceElasticService } from "./elastic";
import { CorrespondenceCreated } from "../../events/CorrespondenceCreated";

interface CreateCorrespondenceInterface {
  name: string;
  description?: string;
  contractorId?: string | null;
  isPrivate: boolean;
  attributes?: UpdatableAttributeInterface[];
}

export type CreateCorrespondenceInClientIdentifier = {};
export type CreateCorrespondenceInProjectIdentifier = { projectId: string };
export type CreateCorrespondenceInDocumentIdentifier = { documentId: string };
export type CreateCorrespondenceInGroupIdentifier = { parentGroupId: string };

export type CreateCorrespondenceIdentifier =
  | CreateCorrespondenceInClientIdentifier
  | CreateCorrespondenceInProjectIdentifier
  | CreateCorrespondenceInDocumentIdentifier
  | CreateCorrespondenceInGroupIdentifier;

@Injectable()
export class CreateCorrespondencesService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    private getCorrespondenceRootGroupService: GetCorrespondenceRootGroupService,
    private createCorrespondenceElasticService: CreateCorrespondenceElasticService,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => UpdateAttributesService)) private updateAttributesService: UpdateAttributesService,
  ) {}

  private async getIdentifierForCreateCorrespondence(
    identifier: CreateCorrespondenceIdentifier,
  ): Promise<DeepPartial<CorrespondenceEntity>> {
    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getCorrespondenceGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: parentGroup.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
        true,
      );

      return { parentGroup: { id: parentGroup.id }, rootGroup: { id: parentGroup.rootGroup.id } };
    }

    if ("projectId" in identifier) {
      const parentProject = await this.getProjectService.getProjectOrFail(identifier.projectId, {
        loadCorrespondenceRootGroup: true,
      });
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: parentProject.id, entityType: PermissionEntityType.PROJECT },
        true,
      );

      return { rootGroup: { id: parentProject.correspondenceRootGroup.id } };
    }

    if ("documentId" in identifier) {
      throw new Error("not implemented");
    }

    const clientRootGroup = await this.getCorrespondenceRootGroupService.unsafeGetCorrespondenceRootGroupOrFail({});
    return { rootGroup: { id: clientRootGroup.id } };
  }

  @Transactional()
  async createCorrespondenceOrFail(identifier: CreateCorrespondenceIdentifier, data: CreateCorrespondenceInterface) {
    const resultIdentifier = await this.getIdentifierForCreateCorrespondence(identifier);

    const currentUser = getCurrentUser();

    const savedCorrespondence = await this.correspondenceRepository.save({
      client: { id: currentUser.clientId },
      ...resultIdentifier,
      name: data.name,
      description: data.description,
      author: { id: currentUser.userId },
      contractor: data.contractorId ? { id: data.contractorId } : null,
      status: CorrespondenceStatus.ACTIVE,
      isPrivate: data.isPrivate,
    });

    await this.updateAttributesService.unsafeUpdateAttributes(
      { entityId: savedCorrespondence.id, category: AttributeCategory.CORRESPONDENCE },
      data.attributes,
    );

    await this.createPermissionService.createPermissionOrFail(
      { entityId: savedCorrespondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
      { userId: currentUser.userId, role: PermissionRole.OWNER },
      { validateCurrentUserPermissions: false },
    );

    await this.createCorrespondenceElasticService.elasticCreateCorrespondenceIndexOrFail(savedCorrespondence.id);

    this.eventEmitter.emit(CorrespondenceCreated.eventName, new CorrespondenceCreated(savedCorrespondence.id));

    return savedCorrespondence.id;
  }
}
