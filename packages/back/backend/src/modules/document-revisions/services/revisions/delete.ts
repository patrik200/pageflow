import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ElasticService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { DictionaryTypes, PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionReturnCountsEntity } from "entities/Document/Document/Revision/ReturnCount";

import { DeleteDocumentRevisionCommentsService } from "modules/document-revision-comments";
import { PermissionAccessService } from "modules/permissions";
import { DictionaryValueDeleted, GetDictionaryValueService } from "modules/dictionary";
import { getCurrentUser } from "modules/auth";

import { RemoveDocumentRevisionFavouritesService } from "../favourites/remove";
import { DeleteDocumentRevisionFilesService } from "../files/delete";
import { DeleteDocumentRevisionResponsibleUserService } from "../responsible-user/user/delete";
import { DeleteDocumentRevisionResponsibleUserFlowService } from "../responsible-user/userFlow/delete";
import { GetDocumentRevisionService } from "./get";
import { DocumentRevisionDeleted } from "../../events/RevisionDeleted";

@Injectable()
export class DeleteDocumentRevisionsService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionReturnCountsEntity)
    private returnCountsRepository: Repository<DocumentRevisionReturnCountsEntity>,
    @Inject(forwardRef(() => DeleteDocumentRevisionCommentsService))
    private deleteDocumentRevisionCommentsService: DeleteDocumentRevisionCommentsService,
    private deleteDocumentRevisionFilesService: DeleteDocumentRevisionFilesService,
    private removeDocumentRevisionFavouritesService: RemoveDocumentRevisionFavouritesService,
    private elasticService: ElasticService,
    private deleteDocumentRevisionResponsibleUserService: DeleteDocumentRevisionResponsibleUserService,
    private deleteDocumentRevisionResponsibleUserFlowService: DeleteDocumentRevisionResponsibleUserFlowService,
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
  ) {}

  @Transactional()
  async deleteRevisionOrFail(
    revisionId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions,
      loadFiles: true,
    });

    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );
    }

    await this.deleteDocumentRevisionResponsibleUserService.deleteResponsibleUserIfNeedOrFail(revision.id);
    await this.deleteDocumentRevisionResponsibleUserFlowService.deleteResponsibleUserFlowIfNeedOrFail(revision.id);

    await Promise.all([
      ...revision.files.map(({ file }) =>
        this.deleteDocumentRevisionFilesService.deleteFileOrFail(revision.id, file.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
      ...revision.comments.map((comment) =>
        this.deleteDocumentRevisionCommentsService.deleteComment(comment.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
      this.removeDocumentRevisionFavouritesService.removeFavouriteOrFail(revision.id, { forAllUsers: true }),
    ]);

    await this.revisionsRepository.delete(revision.id);

    await this.elasticService.deleteIndexDocumentOrFail(
      this.elasticService.getDocumentId("document-revisions", revision.id),
    );

    if (emitEvents) this.eventEmitter.emit(DocumentRevisionDeleted.eventName, new DocumentRevisionDeleted(revision.id));
  }

  @Transactional()
  @OnEvent(DictionaryValueDeleted.eventName)
  private async updateRevisionReturnCountsTypeWhenDeleteDictionaryValue({ payload }: DictionaryValueDeleted) {
    if (payload.dictionaryType !== DictionaryTypes.DOCUMENT_REVISION_RETURN_CODE) return;

    const returnCounts = await this.returnCountsRepository.find({
      where: {
        returnCode: {
          id: payload.dictionaryValueId,
          dictionary: {
            type: DictionaryTypes.DOCUMENT_REVISION_RETURN_CODE,
            client: { id: getCurrentUser().clientId },
          },
        },
      },
      relations: { returnCode: { dictionary: { client: true } } },
    });

    const returnCountIds = returnCounts.map((returnCount) => returnCount.id);

    if (payload.replaceDictionaryValueKey) {
      const dictionaryValue = await this.getDictionaryValueService.getDictionaryValueOrFail(
        payload.replaceDictionaryValueKey,
        DictionaryTypes.DOCUMENT_REVISION_RETURN_CODE,
      );
      await this.returnCountsRepository.update(returnCountIds, {
        returnCode: { id: dictionaryValue.id },
      });
    } else {
      await this.returnCountsRepository.delete(returnCountIds);
    }
  }
}
