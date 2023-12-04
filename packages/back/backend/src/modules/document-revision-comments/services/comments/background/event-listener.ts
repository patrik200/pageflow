import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { AppNotification, NotificationService } from "modules/notifications";
import { GetDocumentRevisionService } from "modules/document-revisions";

import { GetDocumentRevisionCommentsService } from "../get";
import { DocumentRevisionCommentCreated } from "../../../events/CommentCreated";
import { DocumentRevisionCommentResolved } from "../../../events/CommentResolved";

@Injectable()
export class DocumentRevisionCommentEventListenerService implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private getDocumentRevisionCommentsService: GetDocumentRevisionCommentsService,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async handleCommentCreated(commentId: string, triggerUserId: string) {
    const comment = await this.getDocumentRevisionCommentsService.getCommentOrFail(commentId, {
      checkPermissions: false,
    });

    const revision = await this.getDocumentRevisionService.getRevisionOrFail(comment.revision.id, {
      checkPermissions: false,
    });

    const notification = new AppNotification(
      "В ревизию документа добавлен комментарий",
      {
        revisionNumber: revision.number,
        revisionId: revision.id,
        id: comment.id,
        authorName: comment.author.name,
        createdAt: comment.createdAt,
      },
      { emailTemplateName: "DocumentRevisionCommentCreated" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.author.id);
    if (revision.responsibleUserApproving) await notifyUser(revision.responsibleUserApproving.user.id);
  }

  @Transactional()
  async handleCommentResolved(commentId: string, triggerUserId: string) {
    const comment = await this.getDocumentRevisionCommentsService.getCommentOrFail(commentId, {
      checkPermissions: false,
    });

    const revision = await this.getDocumentRevisionService.getRevisionOrFail(comment.revision.id, {
      checkPermissions: false,
    });

    const notification = new AppNotification(
      "Комментарий в ревизии документа решен̆",
      {
        revisionNumber: revision.number,
        revisionId: revision.id,
        id: comment.id,
        authorName: comment.author.name,
        approvedAt: comment.updatedAt,
      },
      { emailTemplateName: "DocumentRevisionCommentApproved" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.author.id);
    await notifyUser(comment.author.id);

    if (revision.responsibleUserApproving) await notifyUser(revision.responsibleUserApproving.user.id);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(DocumentRevisionCommentCreated.eventName, (event: DocumentRevisionCommentCreated) =>
      this.handleCommentCreated(event.commentId, event.triggerUserId).catch(() => null),
    );
    this.eventEmitter.on(DocumentRevisionCommentResolved.eventName, (event: DocumentRevisionCommentResolved) =>
      this.handleCommentResolved(event.commentId, event.triggerUserId).catch(() => null),
    );
  }
}
