import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { AppNotification, NotificationService } from "modules/notifications";

import { GetCorrespondenceRevisionService } from "../revisions/get";
import { CorrespondenceRevisionCreated } from "../../events/RevisionCreated";
import { CorrespondenceRevisionDeleted } from "../../events/RevisionDeleted";
import { CorrespondenceRevisionUpdated } from "../../events/RevisionUpdated";

@Injectable()
export class CorrespondenceRevisionEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
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
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
      loadCorrespondenceAuthor: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: revision.id,
      entityType: ChangeFeedEntityType.CORRESPONDENCE_REVISION,
      eventType: "created",
      data: {
        name: revision.number,
      },
    });

    const notification = new AppNotification(
      "Создана ревизия корреспонденций",
      {
        number: revision.number,
        id: revision.id,
        authorName: revision.author.name,
        createdAt: revision.createdAt,
      },
      { emailTemplateName: "CorrespondenceRevisionCreated" },
      revision.correspondence.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.correspondence.author.id);
  }

  @Transactional()
  private async handleRevisionDeleted(revisionId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: revisionId,
      entityType: ChangeFeedEntityType.CORRESPONDENCE_REVISION,
    });
  }

  @Transactional()
  private async handleRevisionUpdated(
    revisionId: string,
    oldRevision: CorrespondenceRevisionEntity,
    triggerUserId: string,
  ) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions: false,
      loadCorrespondenceAuthor: true,
      loadFiles: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: revisionId,
      entityType: ChangeFeedEntityType.CORRESPONDENCE_REVISION,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(revision.number, oldRevision.number),
        status: this.feedEventChangeDetectionService.change(revision.status, oldRevision.status),
        files: this.feedEventChangeDetectionService.changeForFilesList(revision.files, oldRevision.files),
      },
    });

    const notification = new AppNotification(
      "Ревизия корреспонденции обновленӑ",
      {
        number: revision.number,
        id: revision.id,
        updatedAt: revision.updatedAt,
      },
      { emailTemplateName: "CorrespondenceRevisionUpdated" },
      revision.correspondence.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(revision.correspondence.author.id);
    await notifyUser(revision.author.id);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(CorrespondenceRevisionCreated.eventName, (event: CorrespondenceRevisionCreated) =>
      this.handleRevisionCreated(event.revisionId, event.triggerUserId).catch(() => null),
    );
    this.eventEmitter.on(CorrespondenceRevisionDeleted.eventName, (event: CorrespondenceRevisionDeleted) =>
      this.handleRevisionDeleted(event.revisionId).catch(() => null),
    );
    this.eventEmitter.on(CorrespondenceRevisionUpdated.eventName, (event: CorrespondenceRevisionUpdated) =>
      this.handleRevisionUpdated(event.revisionId, event.oldRevision, event.triggerUserId).catch(() => null),
    );
  }
}
