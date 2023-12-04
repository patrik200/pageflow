import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ElasticService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DictionaryTypes, DocumentRevisionStatus } from "@app/shared-enums";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionReturnCountsEntity } from "entities/Document/Document/Revision/ReturnCount";

import { GetDictionaryValueService } from "modules/dictionary";
import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";

import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";
import { DocumentRevisionResponsibleUserFlowClearNotifiedService } from "../responsible-user/userFlow/clear-notified";

@Injectable()
export class EditDocumentRevisionStatusesService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionReturnCountsEntity)
    private revisionsReturnCountsRepository: Repository<DocumentRevisionReturnCountsEntity>,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    private clearNotifiedMarkService: DocumentRevisionResponsibleUserFlowClearNotifiedService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateElasticDocumentLastRevisionStatus(documentId: string, status: DocumentRevisionStatus) {
    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("documents", documentId, "document"),
      { lastRevisionStatus: status },
    );
  }

  @Transactional()
  async unsafeUpdateRevisionStatusOrFail(
    revision: DocumentRevisionEntity,
    {
      status,
      returnMessage,
      returnCodeKey,
    }: { status: DocumentRevisionStatus; returnMessage?: string | null; returnCodeKey?: string | null },
  ) {
    const updateOptions: QueryDeepPartialEntity<DocumentRevisionEntity> = {
      status,
      statusChangeDate: new Date(),
      statusChangeAuthor: await this.getUserService.getUser(getCurrentUser().userId, "id"),
    };

    if (status === DocumentRevisionStatus.REVIEW) {
      if (revision.status !== DocumentRevisionStatus.REVIEW)
        await this.clearNotifiedMarkService.unsafeClearNotified(revision);

      updateOptions.reviewRequestedCount = () => '"reviewRequestedCount" + 1';
    }
    if (returnMessage !== undefined) updateOptions.returnMessage = returnMessage;
    if (returnCodeKey !== undefined && returnCodeKey !== null) {
      const returnCodeValue = await this.getDictionaryValueService.getDictionaryValueOrFail(
        returnCodeKey,
        DictionaryTypes.DOCUMENT_REVISION_RETURN_CODE,
      );
      const existingReturnCodeCount = await this.revisionsReturnCountsRepository.findOne({
        where: { revision: { id: revision.id }, returnCode: { id: returnCodeValue.id } },
      });
      if (existingReturnCodeCount === null) {
        await this.revisionsReturnCountsRepository.save({
          revision: { id: revision.id },
          returnCode: { id: returnCodeValue.id },
        });
      } else {
        await this.revisionsReturnCountsRepository.increment(
          { revision: { id: revision.id }, returnCode: { id: returnCodeValue.id } },
          "count",
          1,
        );
      }
    }

    await this.revisionsRepository.update(revision.id, updateOptions);

    await this.updateElasticDocumentLastRevisionStatus(revision.document.id, status);

    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));
  }
}
