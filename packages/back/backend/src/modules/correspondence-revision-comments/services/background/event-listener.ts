import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { AppNotification, NotificationService } from "modules/notifications";

import { GetCorrespondenceRevisionCommentService } from "../comments/get";
import { CorrespondenceRevisionCommentCreated } from "../../events/CommentCreated";

@Injectable()
export class CorrespondenceRevisionCommentEventListenerService implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private getCorrespondenceRevisionCommentService: GetCorrespondenceRevisionCommentService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async handleCommentCreated(commentId: string, triggerUserId: string) {
    const comment = await this.getCorrespondenceRevisionCommentService.getCommentOrFail(commentId, {
      checkPermissions: false,
      loadRevisionAuthor: true,
    });

    const notification = new AppNotification(
      "В ревизию корреспонденции добавлен комментарий",
      {
        revisionNumber: comment.revision.number,
        revisionId: comment.revision.id,
        id: comment.id,
        authorName: comment.author.name,
        createdAt: comment.createdAt,
      },
      { emailTemplateName: "CorrespondenceRevisionCommentCreated" },
      comment.revision.correspondence.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(comment.revision.author.id);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(
      CorrespondenceRevisionCommentCreated.eventName,
      (event: CorrespondenceRevisionCommentCreated) =>
        this.handleCommentCreated(event.commentId, event.triggerUserId).catch(() => null),
    );
  }
}
