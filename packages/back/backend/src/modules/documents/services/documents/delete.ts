import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DictionaryTypes, PermissionEntityType } from "@app/shared-enums";

import { DocumentEntity } from "entities/Document/Document";

import { DeleteCorrespondenceRootGroupService } from "modules/correspondences";
import { DictionaryValueDeleted } from "modules/dictionary";
import { DeleteDocumentRevisionsService } from "modules/document-revisions";
import { DeletePermissionService, PermissionAccessService } from "modules/permissions";
import { getCurrentUser } from "modules/auth";

import { RemoveDocumentFavouritesService } from "./favourites";
import { DeleteDocumentsElasticService } from "./elastic";
import { GetDocumentService } from "./get";
import { EditDocumentService } from "./edit";
import { DocumentDeleted } from "../../events/DocumentDeleted";

@Injectable()
export class DeleteDocumentService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private getDocumentService: GetDocumentService,
    private deleteDocumentsElasticService: DeleteDocumentsElasticService,
    private removeDocumentFavouritesService: RemoveDocumentFavouritesService,
    @Inject(forwardRef(() => DeleteCorrespondenceRootGroupService))
    private deleteCorrespondenceRootGroupService: DeleteCorrespondenceRootGroupService,
    @Inject(forwardRef(() => DeleteDocumentRevisionsService))
    private deleteDocumentRevisionsService: DeleteDocumentRevisionsService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
    private editDocumentService: EditDocumentService,
  ) {}

  @Transactional()
  async deleteDocumentOrFail(documentId: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadRevisions: true,
      loadCorrespondenceRootGroup: true,
    });

    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );
    }

    await Promise.all([
      ...document.revisions.map((revision) =>
        this.deleteDocumentRevisionsService.deleteRevisionOrFail(revision.id, {
          checkPermissions: false,
        }),
      ),
      this.removeDocumentFavouritesService.removeDocumentFavouriteOrFail(document.id),
      this.deleteCorrespondenceRootGroupService.deleteGroupOrFail(document.correspondenceRootGroup.id),
      this.deletePermissionService.deleteAllPermissionsOrFail({
        entityId: document.id,
        entityType: PermissionEntityType.DOCUMENT,
      }),
    ]);

    await Promise.all([
      this.documentRepository.delete(document.id),
      this.deleteDocumentsElasticService.elasticDeleteDocumentIndexOrFail(document.id),
    ]);

    this.eventEmitter.emit(DocumentDeleted.eventName, new DocumentDeleted(document.id));
  }

  @Transactional()
  @OnEvent(DictionaryValueDeleted.eventName)
  private async updateDocumentTypeWhenDeleteDictionaryValue({ payload }: DictionaryValueDeleted) {
    if (payload.dictionaryType !== DictionaryTypes.DOCUMENT_TYPE) return;

    const documents = await this.documentRepository.find({
      where: {
        type: {
          id: payload.dictionaryValueId,
          dictionary: { type: DictionaryTypes.DOCUMENT_TYPE, client: { id: getCurrentUser().clientId } },
        },
      },
      relations: { type: { dictionary: { client: true } } },
    });

    for (const document of documents) {
      await this.editDocumentService.updateDocumentOrFail(
        { documentId: document.id },
        {
          typeKey: payload.replaceDictionaryValueKey,
        },
        { waitForUpdateEventComplete: true },
      );
    }
  }
}
