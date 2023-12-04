import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { AppNotification, NotificationService } from "modules/notifications";
import { GetDocumentRevisionService } from "modules/document-revisions";

import { GetDocumentRevisionCommentDiscussionsService } from "../get";
import { DocumentRevisionDiscussionCreated } from "../../../events/DiscussionCreated";

@Injectable()
export class DocumentRevisionDiscussionEventListenerService implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private getDocumentRevisionCommentDiscussionsService: GetDocumentRevisionCommentDiscussionsService,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
    private eventEmitter: EventEmitter2,
  ) {}

  async handleDiscussionCreated(discussionId: string, triggerUserId: string) {
    const discussion = await this.getDocumentRevisionCommentDiscussionsService.getDiscussionOrFail(discussionId, {
      checkPermissions: false,
      loadAuthor: true,
      loadCommentAuthor: true,
    });

    const revision = await this.getDocumentRevisionService.getRevisionOrFail(discussion.comment.revision.id, {
      checkPermissions: false,
    });

    const notification = new AppNotification(
      "В ревизию документа добавлен комментарий",
      {
        revisionNumber: revision.number,
        revisionId: revision.id,
        id: discussion.id,
        authorName: discussion.author.name,
        createdAt: discussion.createdAt,
      },
      { emailTemplateName: "DocumentRevisionCommentCreated" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(discussion.comment.author.id);
    await notifyUser(revision.author.id);
    if (revision.responsibleUserApproving) await notifyUser(revision.responsibleUserApproving.user.id);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(DocumentRevisionDiscussionCreated.eventName, (event: DocumentRevisionDiscussionCreated) =>
      this.handleDiscussionCreated(event.discussionId, event.triggerUserId),
    );
  }
}
