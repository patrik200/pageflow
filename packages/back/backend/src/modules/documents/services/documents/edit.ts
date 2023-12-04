import { TypeormUpdateEntity, typeormUpdateNullOrUndefined } from "@app/back-kit";
import { AttributeCategory, DictionaryTypes, PermissionEntityType, PermissionRole } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { isNil } from "@worksolutions/utils";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";

import { GetDictionaryValueService } from "modules/dictionary";
import { CreatePermissionService, PermissionAccessService } from "modules/permissions";
import { UpdatableAttributeInterface, UpdateAttributesService } from "modules/attributes";

import { EditDocumentsElasticService } from "./elastic";
import { GetDocumentService } from "./get";
import { GetDocumentResponsibleUserService } from "./get-responsible-user";
import { DocumentResponsibleUserFlowUpdated } from "../../events/DocumentResponsibleUserFlowUpdated";
import { DocumentResponsibleUserUpdated } from "../../events/DocumentResponsibleUserUpdated";
import { DocumentUpdated } from "../../events/DocumentUpdated";

export interface UpdateDocumentInterface {
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
  attributes?: UpdatableAttributeInterface[];
}

@Injectable()
export class EditDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @Inject(forwardRef(() => GetDictionaryValueService))
    private getDictionaryValueService: GetDictionaryValueService,
    private getDocumentService: GetDocumentService,
    private editDocumentsElasticService: EditDocumentsElasticService,
    @Inject(forwardRef(() => GetDocumentResponsibleUserService))
    private getDocumentsResponsibleUserService: GetDocumentResponsibleUserService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => CreatePermissionService)) private createPermissionService: CreatePermissionService,
    @Inject(forwardRef(() => UpdateAttributesService)) private updateAttributesService: UpdateAttributesService,
  ) {}

  @Transactional()
  // eslint-disable-next-line complexity
  async updateDocumentOrFail(
    identifierOptions: { documentId: string },
    data: UpdateDocumentInterface,
    options: { waitForUpdateEventComplete?: boolean } = {},
  ) {
    const document = await this.getDocumentService.getDocumentOrFail(identifierOptions.documentId, {
      loadResponsibleUser: true,
      loadResponsibleUserFlow: true,
      loadType: true,
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadAttributes: true,
    });

    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
      true,
    );

    const updateOptions: TypeormUpdateEntity<DocumentEntity> = {};

    if (data.name !== undefined) updateOptions.name = data.name;
    if (data.description !== undefined) updateOptions.description = data.description;
    if (data.remarks !== undefined) updateOptions.remarks = data.remarks;
    if (data.startDatePlan !== undefined) updateOptions.startDatePlan = data.startDatePlan;
    if (data.startDateForecast !== undefined) updateOptions.startDateForecast = data.startDateForecast;
    if (data.startDateFact !== undefined) updateOptions.startDateFact = data.startDateFact;
    if (data.endDatePlan !== undefined) updateOptions.endDatePlan = data.endDatePlan;
    if (data.endDateForecast !== undefined) updateOptions.endDateForecast = data.endDateForecast;
    if (data.endDateFact !== undefined) updateOptions.startDateFact = data.endDateFact;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;

    const [type, responsibleUserId, responsibleUserFlow] = await Promise.all([
      isNil(data.typeKey)
        ? data.typeKey
        : this.getDictionaryValueService.getDictionaryValueOrFail(data.typeKey, DictionaryTypes.DOCUMENT_TYPE),
      isNil(data.responsibleUserId)
        ? data.responsibleUserId
        : this.getDocumentsResponsibleUserService.getResponsibleUserIdOrFail(data.responsibleUserId),
      isNil(data.responsibleUserFlowId)
        ? data.responsibleUserFlowId
        : this.getDocumentsResponsibleUserService.getResponsibleUserFlowOrFail(data.responsibleUserFlowId, {
            loadReviewer: true,
            loadReviewerUser: true,
            loadRows: true,
            loadRowsUsers: true,
            loadRowsUsersUser: true,
          }),
    ]);

    const [attributes] = await Promise.all([
      this.updateAttributesService.unsafeUpdateAttributes(
        { entityId: document.id, category: AttributeCategory.DOCUMENT },
        data.attributes,
      ),
      this.documentRepository.update(
        document.id,
        Object.assign(
          {},
          updateOptions,
          typeormUpdateNullOrUndefined<string>(responsibleUserId, "responsibleUser"),
          typeormUpdateNullOrUndefined<string>(
            data.responsibleUserFlowId,
            "responsibleUserFlow",
            responsibleUserFlow?.id,
          ),
          typeormUpdateNullOrUndefined<string>(data.typeKey, "type", type?.id),
          // typeormUpdateNullOrUndefined<string>(data.contractorId, "contractorId"),
        ),
      ),
    ]);

    if (responsibleUserId) {
      await this.createPermissionService.createPermissionOrFail(
        { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
        { userId: responsibleUserId, role: PermissionRole.EDITOR, canEditEditorPermissions: true },
        { validateCurrentUserPermissions: true },
      );
    }

    if (responsibleUserFlow) {
      await Promise.all([
        responsibleUserFlow.reviewer &&
          this.createPermissionService.createPermissionOrFail(
            { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
            {
              userId: responsibleUserFlow.reviewer.user.id,
              role: PermissionRole.READER,
              canEditReaderPermissions: true,
            },
            { validateCurrentUserPermissions: true },
          ),
        ...responsibleUserFlow.rows.map((row) =>
          Promise.all(
            row.users.map((rowUser) =>
              this.createPermissionService.createPermissionOrFail(
                { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
                { userId: rowUser.user.id, role: PermissionRole.READER, canEditReaderPermissions: true },
                { validateCurrentUserPermissions: true },
              ),
            ),
          ),
        ),
      ]);
    }

    if (responsibleUserId !== undefined)
      this.eventEmitter.emit(
        DocumentResponsibleUserUpdated.eventName,
        new DocumentResponsibleUserUpdated(document.id, responsibleUserId),
      );

    if (responsibleUserFlow !== undefined)
      this.eventEmitter.emit(
        DocumentResponsibleUserFlowUpdated.eventName,
        new DocumentResponsibleUserFlowUpdated(document.id, responsibleUserFlow),
      );

    await this.editDocumentsElasticService.elasticUpdateDocumentIndexOrFail(document.id, { ...data, attributes }, type);

    if (options.waitForUpdateEventComplete) {
      await this.eventEmitter.emitAsync(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
    } else {
      this.eventEmitter.emit(DocumentUpdated.eventName, new DocumentUpdated(document.id, document));
    }
  }
}
