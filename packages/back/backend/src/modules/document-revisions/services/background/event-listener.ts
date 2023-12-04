import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { AppNotification, NotificationService } from "modules/notifications";

import { GetDocumentRevisionService } from "../revisions/get";
import { DocumentRevisionCreated } from "../../events/RevisionCreated";
import { DocumentRevisionDeleted } from "../../events/RevisionDeleted";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class DocumentRevisionEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => DeleteChangeFeedEventService))
    private deleteChangeFeedEventService: DeleteChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
  ) {}

  @Transactional()
  private async handleRevisionCreated(revisionId: string, triggerUserId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
      loadDocumentAuthor: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: revision.id,
      entityType: ChangeFeedEntityType.DOCUMENT_REVISION,
      eventType: "created",
      data: {
        name: revision.number,
      },
    });

    const notification = new AppNotification(
      "Создана ревизия документа",
      {
        documentName: revision.document.name,
        number: revision.number,
        id: revision.id,
        authorName: revision.author.name,
        createdAt: revision.createdAt,
        responsibleUserName: revision.responsibleUserApproving?.user.name ?? null,
        responsibleUserFlowName: revision.responsibleUserFlowApproving?.name ?? null,
      },
      { emailTemplateName: "DocumentRevisionCreated" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.document.author.id);
    if (revision.responsibleUserApproving) await notifyUser(revision.responsibleUserApproving.user.id);
    if (revision.responsibleUserFlowApproving) {
      await Promise.all([
        revision.responsibleUserFlowApproving.reviewer &&
          notifyUser(revision.responsibleUserFlowApproving.reviewer.user.id),
        ...revision.responsibleUserFlowApproving.rows.map((row) =>
          Promise.all(row.users.map((rowUser) => notifyUser(rowUser.user.id))),
        ),
      ]);
    }
  }

  @Transactional()
  private async handleRevisionDeleted(revisionId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: revisionId,
      entityType: ChangeFeedEntityType.DOCUMENT_REVISION,
    });
  }

  private detectDiffEmpty(diff: { from: Record<string, any>; to: Record<string, any> }) {
    const dataFrom = Object.entries(diff.from).filter(([, value]) => value !== undefined);
    const dataTo = Object.entries(diff.to).filter(([, value]) => value !== undefined);
    if (dataFrom.length === 0 && dataTo.length === 0) return undefined;
    return diff;
  }

  private changeResponsibleUserApproving(
    newValue: DocumentRevisionResponsibleUserEntity | null | undefined,
    oldValue: DocumentRevisionResponsibleUserEntity | null | undefined,
  ) {
    if (newValue === undefined || oldValue === undefined) return undefined;

    if (newValue) {
      if (oldValue) {
        const diff: { from: Record<string, any>; to: Record<string, any> } = { from: {}, to: {} };

        if (newValue.user.id !== oldValue.user.id) {
          diff.from.user = oldValue.user.id;
          diff.to.user = newValue.user.id;
        }

        if (newValue.comment !== oldValue.comment) {
          diff.from.comment = oldValue.comment;
          diff.to.comment = newValue.comment;
        }

        if (newValue.approved !== oldValue.approved) {
          diff.from.approved = oldValue.approved;
          diff.to.approved = newValue.approved;
        }

        return this.detectDiffEmpty(diff);
      }

      return { from: null, to: { user: newValue.user.id } };
    }

    if (oldValue) return { from: { user: oldValue.user.id }, to: null };

    return undefined;
  }

  private changeResponsibleUserFlowApproving(
    newValue: DocumentRevisionResponsibleUserFlowEntity | null | undefined,
    oldValue: DocumentRevisionResponsibleUserFlowEntity | null | undefined,
  ) {
    if (newValue === undefined || oldValue === undefined) return undefined;

    if (newValue) {
      if (oldValue) {
        const diff: { from: Record<string, any>; to: Record<string, any> } = { from: {}, to: {} };

        if (newValue.rowsApproved !== oldValue.rowsApproved) {
          diff.from.rowsApproved = oldValue.rowsApproved;
          diff.to.rowsApproved = newValue.rowsApproved;
        }

        if (newValue.reviewer && oldValue.reviewer) {
          if (newValue.reviewer.approved !== oldValue.reviewer.approved) {
            diff.from.reviewerApproved = oldValue.reviewer.approved;
            diff.to.reviewerApproved = newValue.reviewer.approved;
          }
          if (newValue.reviewer.comment !== oldValue.reviewer.comment) {
            diff.from.reviewerComment = oldValue.reviewer.comment;
            diff.to.reviewerComment = newValue.reviewer.comment;
          }
        }

        return this.detectDiffEmpty(diff);
      }

      return { from: null, to: { name: newValue.name } };
    }

    if (oldValue) return { from: { name: oldValue.name }, to: null };

    return undefined;
  }

  @Transactional()
  private async handleRevisionUpdated(revisionId: string, oldRevision: DocumentRevisionEntity, triggerUserId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
      loadFiles: true,
      loadDocumentAuthor: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: revisionId,
      entityType: ChangeFeedEntityType.DOCUMENT_REVISION,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(revision.number, oldRevision.number),
        status: this.feedEventChangeDetectionService.change(revision.status, oldRevision.status),
        files: this.feedEventChangeDetectionService.changeForFilesList(revision.files, oldRevision.files),
        responsibleUserApproving: this.changeResponsibleUserApproving(
          revision.responsibleUserApproving,
          oldRevision.responsibleUserApproving,
        ),
        responsibleUserFlowApproving: this.changeResponsibleUserFlowApproving(
          revision.responsibleUserFlowApproving,
          oldRevision.responsibleUserFlowApproving,
        ),
        returnMessage: this.feedEventChangeDetectionService.change(revision.returnMessage, oldRevision.returnMessage),
        approvingDeadline: this.feedEventChangeDetectionService.change(
          revision.approvingDeadline,
          oldRevision.approvingDeadline,
        ),
        canProlongApprovingDeadline: this.feedEventChangeDetectionService.change(
          revision.canProlongApprovingDeadline,
          oldRevision.canProlongApprovingDeadline,
        ),
      },
    });

    const notification = new AppNotification(
      "Ревизия корреспонденции обновленӑ",
      {
        number: revision.number,
        id: revision.id,
        updatedAt: revision.updatedAt,
      },
      { emailTemplateName: "DocumentRevisionUpdated" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.document.author.id);
    await notifyUser(revision.author.id);
    if (revision.responsibleUserApproving) await notifyUser(revision.responsibleUserApproving.user.id);
    if (revision.responsibleUserFlowApproving) {
      await Promise.all([
        revision.responsibleUserFlowApproving.reviewer &&
          notifyUser(revision.responsibleUserFlowApproving.reviewer.user.id),
        ...revision.responsibleUserFlowApproving.rows.map((row) =>
          Promise.all(row.users.map((rowUser) => notifyUser(rowUser.user.id))),
        ),
      ]);
    }
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(DocumentRevisionCreated.eventName, (event: DocumentRevisionCreated) =>
      this.handleRevisionCreated(event.revisionId, event.triggerUserId).catch(() => null),
    );
    this.eventEmitter.on(DocumentRevisionDeleted.eventName, (event: DocumentRevisionDeleted) =>
      this.handleRevisionDeleted(event.revisionId).catch(() => null),
    );
    this.eventEmitter.on(DocumentRevisionUpdated.eventName, (event: DocumentRevisionUpdated) =>
      this.handleRevisionUpdated(event.revisionId, event.oldRevision, event.triggerUserId).catch(() => null),
    );
  }
}
