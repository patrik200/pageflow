import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { AppNotification, NotificationService } from "modules/notifications";

import { GetDocumentRevisionService } from "../../revisions/get";
import { DocumentRevisionUserFlowDeadline } from "../../../events/RevisionUserFlowDeadline";

@Injectable()
export class DocumentRevisionUserFlowDeadlineEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionService: GetDocumentRevisionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
  ) {}

  @Transactional()
  private async handleApprovingDeadline(revisionId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
      loadDocumentAuthor: true,
    });

    const notification = new AppNotification(
      "Крайний срок утверждения маршрута документа прошел",
      {
        number: revision.number,
        id: revision.id,
        deadlineAt: revision.approvingDeadline,
      },
      { emailTemplateName: "DocumentRevisionUserFlowDeadlineAppeared" },
      revision.document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification);

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

  onApplicationBootstrap() {
    this.eventEmitter.on(DocumentRevisionUserFlowDeadline.eventName, (event: DocumentRevisionUserFlowDeadline) =>
      this.handleApprovingDeadline(event.revisionId),
    );
  }
}
