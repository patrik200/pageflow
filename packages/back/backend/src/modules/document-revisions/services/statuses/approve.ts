import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Reviewer";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

interface ApproveOptionsInterface {
  userFlowRowIndex?: number;
  userFlowRowUserIndex?: number;
  result?: string;
  comment?: string;
}

@Injectable()
export class ApproveDocumentRevisionStatusesService {
  constructor(
    @InjectRepository(DocumentRevisionResponsibleUserEntity)
    private responsibleUserRepository: Repository<DocumentRevisionResponsibleUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private responsibleUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserEntity)
    private responsibleUserFlowRowUserRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowReviewerEntity)
    private responsibleUserFlowReviewerRepository: Repository<DocumentRevisionResponsibleUserFlowReviewerEntity>,
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async approveRevisionOrFail(revisionId: string, options: ApproveOptionsInterface = {}) {
    const { userFlowRowIndex, userFlowRowUserIndex } = options;

    if (userFlowRowIndex === undefined && userFlowRowUserIndex === undefined) {
      await this.tryToApproveRevisionResponsibleUserOrFail(revisionId, options);
      return;
    }

    if (userFlowRowIndex === -1 && userFlowRowUserIndex === -1) {
      await this.tryToApproveRevisionUserFlowReviewerOrFail(revisionId, options);
      return;
    }

    if (userFlowRowIndex !== undefined && userFlowRowUserIndex !== undefined) {
      await this.tryToApproveRevisionUserFlowOrFail(revisionId, options);
      return;
    }
  }

  private async tryToApproveRevisionResponsibleUserOrFail(revisionId: string, options: ApproveOptionsInterface) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );
    if (!revision.canMoveToApprovedStatusByResponsibleUser)
      throw new ServiceError("state", "Обновление статуса ревизии недоступно");

    await this.responsibleUserRepository.update(revision.responsibleUserApproving!.id, {
      approved: true,
      comment: options.comment,
    });
    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));
    await this.tryToApproveRevisionOrFail(revision.id);
  }

  private async tryToApproveRevisionUserFlowReviewerOrFail(revisionId: string, options: ApproveOptionsInterface) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "reader",
    );
    if (!revision.responsibleUserFlowApproving?.reviewer) throw new ServiceError("state", "Подписант не установлен");
    if (revision.responsibleUserFlowApproving.approved)
      throw new ServiceError("state", "Маршрут документа уже утвержден");
    if (!revision.responsibleUserFlowApproving.rowsApproved)
      throw new ServiceError("state", "Не все шаги машрута документа утверждены. Утверждение не доступно");

    await this.responsibleUserFlowReviewerRepository.update(revision.responsibleUserFlowApproving.reviewer.id, {
      approved: true,
      comment: options.comment,
    });

    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));

    await this.tryToApproveRevisionOrFail(revision.id);
  }

  private async tryToApproveRevisionUserFlowOrFail(
    revisionId: string,
    options: Omit<ApproveOptionsInterface, "comment">,
  ) {
    const [revision, originalRevision] = await Promise.all([
      this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(revisionId, "reader"),
      this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(revisionId, "reader"),
    ]);
    if (options.userFlowRowIndex === undefined || options.userFlowRowUserIndex === undefined)
      throw new ServiceError("state", "Неизвестное состояние");

    const { responsibleUserFlowApproving: userFlow } = revision;
    if (!userFlow) throw new ServiceError("state", "Маршрут документа для этой ревизии не установлен");

    const row = userFlow.rows[options.userFlowRowIndex];
    const rowUser = row.users[options.userFlowRowUserIndex];
    if (!rowUser) throw new ServiceError("state", "Неизвестное состояние");
    if (rowUser.approved) throw new ServiceError("state", "Этот пользователь уже утвердил шаг");

    const tasks: Promise<any>[] = [];

    tasks.push(
      this.responsibleUserFlowRowUserRepository.update(rowUser.id, { approved: true, result: options.result }),
    );

    rowUser.approved = true;
    revision.calculateResponsibleUserFlowApprovingRowsCompleted();

    if (userFlow.rowsApproved!)
      tasks.push(this.responsibleUserFlowRepository.update(userFlow.id, { approvedDate: new Date() }));

    await Promise.all(tasks);

    this.eventEmitter.emit(
      DocumentRevisionUpdated.eventName,
      new DocumentRevisionUpdated(revision.id, originalRevision),
    );

    await this.tryToApproveRevisionOrFail(revision.id);
  }

  @Transactional()
  async tryToApproveRevisionOrFail(revisionId: string) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "reader",
    );
    if (revision.responsibleUserApproving && !revision.responsibleUserApproving.approved) return;
    if (revision.responsibleUserFlowApproving && !revision.responsibleUserFlowApproving.approved) return;
    if (revision.moveToApprovedStatusByResponsibleUserFlowStoppedByUnresolvedComment) return;

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status:
        revision.responsibleUserApproving?.comment || revision.responsibleUserFlowApproving?.reviewer?.comment
          ? DocumentRevisionStatus.APPROVED_WITH_COMMENT
          : DocumentRevisionStatus.APPROVED,
      returnMessage: null,
      returnCodeKey: null,
    });
  }
}
