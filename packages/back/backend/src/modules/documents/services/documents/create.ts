import {
  AttributeCategory,
  DictionaryTypes,
  DocumentStatus,
  PermissionEntityType,
  PermissionRole,
} from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";
import { CreateCorrespondenceRootGroupService } from "modules/correspondences";
import { GetDictionaryValueService } from "modules/dictionary";
import { GetProjectService } from "modules/projects";
import { CreatePermissionService, PermissionAccessService } from "modules/permissions";
import { UpdatableAttributeInterface, UpdateAttributesService } from "modules/attributes";

import { GetDocumentResponsibleUserService } from "./get-responsible-user";
import { GetDocumentGroupService } from "../groups/get";
import { CreateDocumentsElasticService } from "./elastic";
import { DocumentCreated } from "../../events/DocumentCreated";

interface CreateDocumentInterface {
  name: string;
  description?: string;
  remarks?: string;
  responsibleUserId?: string;
  responsibleUserFlowId?: string;
  typeKey?: string;
  contractorId?: string;
  startDatePlan?: Date;
  startDateForecast?: Date;
  startDateFact?: Date;
  endDatePlan?: Date;
  endDateForecast?: Date;
  endDateFact?: Date;
  isPrivate: boolean;
  attributes?: UpdatableAttributeInterface[];
}

export type CreateDocumentInProjectIdentifier = { projectId: string };
export type CreateDocumentInGroupIdentifier = { parentGroupId: string };

export type CreateDocumentIdentifier = CreateDocumentInProjectIdentifier | CreateDocumentInGroupIdentifier;

@Injectable()
export class CreateDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @Inject(forwardRef(() => GetDictionaryValueService))
    private getDictionaryValueService: GetDictionaryValueService,
    private createDocumentsElasticService: CreateDocumentsElasticService,
    @Inject(forwardRef(() => CreateCorrespondenceRootGroupService))
    private createCorrespondenceRootGroupService: CreateCorrespondenceRootGroupService,
    @Inject(forwardRef(() => GetDocumentResponsibleUserService))
    private getDocumentsResponsibleUserService: GetDocumentResponsibleUserService,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    private getDocumentGroupService: GetDocumentGroupService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    @Inject(forwardRef(() => UpdateAttributesService)) private updateAttributesService: UpdateAttributesService,
  ) {}

  private async getIdentifierForCreateDocument(
    identifier: CreateDocumentIdentifier,
  ): Promise<DeepPartial<DocumentEntity>> {
    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getDocumentGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: parentGroup.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );

      return { parentGroup: { id: parentGroup.id }, rootGroup: { id: parentGroup.rootGroup.id } };
    }

    if ("projectId" in identifier) {
      const parentProject = await this.getProjectService.getProjectOrFail(identifier.projectId, {
        loadDocumentRootGroup: true,
      });

      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: parentProject.id, entityType: PermissionEntityType.PROJECT },
        true,
      );

      return { rootGroup: { id: parentProject.documentRootGroup.id } };
    }

    throw new Error("unknown state");
  }

  @Transactional()
  private async getType(typeKey: string | undefined) {
    if (!typeKey) return null;
    const type = await this.getDictionaryValueService.getDictionaryValueOrFail(typeKey, DictionaryTypes.DOCUMENT_TYPE);
    return type.id;
  }

  @Transactional()
  private async createCorrespondenceRootGroup(document: DocumentEntity) {
    return await this.createCorrespondenceRootGroupService.createGroupOrFail(
      { documentId: document.id },
      { name: "Root group for " + document.id },
    );
  }

  @Transactional()
  private async getResponsibleUser(responsibleUserId: string | undefined) {
    if (!responsibleUserId) return null;
    return await this.getDocumentsResponsibleUserService.getResponsibleUserIdOrFail(responsibleUserId);
  }

  @Transactional()
  private async getResponsibleUserFlow(responsibleUserFlowId: string | undefined) {
    if (!responsibleUserFlowId) return null;
    return this.getDocumentsResponsibleUserService.getResponsibleUserFlowOrFail(responsibleUserFlowId, {
      loadReviewer: true,
      loadReviewerUser: true,
      loadRows: true,
      loadRowsUsers: true,
      loadRowsUsersUser: true,
    });
  }

  @Transactional()
  async createDocumentOrFail(identifier: CreateDocumentIdentifier, data: CreateDocumentInterface) {
    const resultIdentifier = await this.getIdentifierForCreateDocument(identifier);

    const currentUser = getCurrentUser();

    const savedDocument = await this.documentRepository.save({
      ...resultIdentifier,
      author: { id: currentUser.userId },
      name: data.name,
      description: data.description,
      remarks: data.remarks,
      // contractor: data.contractorId ? { id: data.contractorId } : null,
      startDatePlan: data.startDatePlan,
      startDateForecast: data.startDateForecast,
      startDateFact: data.startDateFact,
      endDatePlan: data.endDatePlan,
      endDateForecast: data.endDateForecast,
      endDateFact: data.endDateFact,
      client: { id: currentUser.clientId },
      status: DocumentStatus.ACTIVE,
      isPrivate: data.isPrivate,
    });

    const [typeId, correspondenceRootGroupId, responsibleUserId, responsibleUserFlow] = await Promise.all([
      this.getType(data.typeKey),
      this.createCorrespondenceRootGroup(savedDocument),
      this.getResponsibleUser(data.responsibleUserId),
      this.getResponsibleUserFlow(data.responsibleUserFlowId),
    ]);

    await this.documentRepository.update(savedDocument.id, {
      responsibleUser: responsibleUserId ? { id: responsibleUserId } : null,
      responsibleUserFlow: responsibleUserFlow ? { id: responsibleUserFlow.id } : null,
      type: typeId ? { id: typeId } : null,
      correspondenceRootGroup: { id: correspondenceRootGroupId },
    });

    await this.updateAttributesService.unsafeUpdateAttributes(
      { entityId: savedDocument.id, category: AttributeCategory.DOCUMENT },
      data.attributes,
    );

    await this.createPermissionService.createPermissionOrFail(
      { entityId: savedDocument.id, entityType: PermissionEntityType.DOCUMENT },
      { userId: currentUser.userId, role: PermissionRole.OWNER },
      { validateCurrentUserPermissions: false },
    );

    if (responsibleUserId) {
      await this.createPermissionService.createPermissionOrFail(
        { entityId: savedDocument.id, entityType: PermissionEntityType.DOCUMENT },
        { userId: responsibleUserId, role: PermissionRole.EDITOR, canEditEditorPermissions: true },
        { validateCurrentUserPermissions: false },
      );
    }

    if (responsibleUserFlow) {
      await Promise.all([
        responsibleUserFlow.reviewer &&
          this.createPermissionService.createPermissionOrFail(
            { entityId: savedDocument.id, entityType: PermissionEntityType.DOCUMENT },
            { userId: responsibleUserFlow.reviewer.user.id, role: PermissionRole.READER },
            { validateCurrentUserPermissions: false },
          ),
        ...responsibleUserFlow.rows.map((row) =>
          Promise.all(
            row.users.map((rowUser) =>
              this.createPermissionService.createPermissionOrFail(
                { entityId: savedDocument.id, entityType: PermissionEntityType.DOCUMENT },
                { userId: rowUser.user.id, role: PermissionRole.READER },
                { validateCurrentUserPermissions: false },
              ),
            ),
          ),
        ),
      ]);
    }

    await this.createDocumentsElasticService.elasticCreateDocumentIndexOrFail(savedDocument.id);

    this.eventEmitter.emit(DocumentCreated.eventName, new DocumentCreated(savedDocument.id));

    return savedDocument.id;
  }
}
