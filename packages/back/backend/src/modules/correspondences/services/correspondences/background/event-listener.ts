import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType, PermissionEntityType } from "@app/shared-enums";
import { SentryTextService } from "@app/back-kit";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { AppNotification, NotificationService } from "modules/notifications";
import { GetProjectService } from "modules/projects";
import { GetDocumentService } from "modules/documents";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceService } from "../get";
import { GetCorrespondenceGroupService } from "../../groups/get";
import { CorrespondenceCreated } from "../../../events/CorrespondenceCreated";
import { CorrespondenceDeleted } from "../../../events/CorrespondenceDeleted";
import { CorrespondenceUpdated } from "../../../events/CorrespondenceUpdated";

@Injectable()
export class CorrespondenceEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    private getCorrespondenceService: GetCorrespondenceService,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => DeleteChangeFeedEventService))
    private deleteChangeFeedEventService: DeleteChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private sentryTextService: SentryTextService,
  ) {}

  private async handleCorrespondencePermissionsNotify(
    correspondence: CorrespondenceEntity,
    notifyUser: (userId: string) => Promise<void>,
  ) {
    await Promise.all(correspondence.permissions!.map((permission) => notifyUser(permission.user.id)));
    if (correspondence.isPrivate) return;

    if (correspondence.parentGroup) {
      const group = await this.getCorrespondenceGroupService.getGroupOrFail(correspondence.parentGroup.id, {
        checkPermissions: false,
        loadPermissions: true,
      });

      if (correspondence.isPrivate) {
        await Promise.all(
          group.permissions!.map(async (groupPermission) => {
            const hasAccess = await this.permissionAccessService.validateToRead(
              { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
              false,
              groupPermission.user.id,
            );
            if (hasAccess) return notifyUser(groupPermission.user.id);
          }),
        );
        return;
      }

      await Promise.all(group.permissions!.map((groupPermission) => notifyUser(groupPermission.user.id)));
      return;
    }

    if (correspondence.rootGroup.parentProject) {
      const project = await this.getProjectService.getProjectOrFail(correspondence.rootGroup.parentProject.id, {
        checkPermissions: false,
        loadPermissions: true,
      });

      if (project.isPrivate) {
        await Promise.all(
          project.permissions!.map(async (projectPermission) => {
            const hasAccess = await this.permissionAccessService.validateToRead(
              { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
              false,
              projectPermission.user.id,
            );
            if (hasAccess) return notifyUser(projectPermission.user.id);
          }),
        );
        return;
      }

      await Promise.all(project.permissions!.map((projectPermission) => notifyUser(projectPermission.user.id)));
      return;
    }

    if (correspondence.rootGroup.parentDocument) {
      const document = await this.getDocumentService.getDocumentOrFail(correspondence.rootGroup.parentDocument.id, {
        checkPermissions: false,
        loadPermissions: true,
        permissionSelectOptions: { loadUser: true },
      });

      if (document.isPrivate) {
        await Promise.all(
          document.permissions!.map(async (documentPermission) => {
            const hasAccess = await this.permissionAccessService.validateToRead(
              { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
              false,
              documentPermission.user.id,
            );
            if (hasAccess) return notifyUser(documentPermission.user.id);
          }),
        );
        return;
      }

      await Promise.all(document.permissions!.map((documentPermission) => notifyUser(documentPermission.user.id)));
      return;
    }
  }

  @Transactional()
  private async handleCorrespondenceCreated(correspondenceId: string, triggerUserId: string) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      checkPermissions: false,
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadClient: true,
      loadParentGroup: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
      loadRootGroupParentDocument: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: correspondence.id,
      entityType: ChangeFeedEntityType.CORRESPONDENCE,
      eventType: "created",
      data: {
        name: correspondence.name,
      },
    });

    const notification = new AppNotification(
      "Создана новая корреспонденция",
      {
        name: correspondence.name,
        id: correspondence.id,
        authorName: correspondence.author.name,
        createdAt: correspondence.createdAt,
      },
      { emailTemplateName: "CorrespondenceCreated" },
      correspondence.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await this.handleCorrespondencePermissionsNotify(correspondence, notifyUser);
  }

  @Transactional()
  private async handleCorrespondenceDeleted(correspondenceId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: correspondenceId,
      entityType: ChangeFeedEntityType.CORRESPONDENCE,
    });
  }

  @Transactional()
  private async handleCorrespondenceUpdated(
    correspondenceId: string,
    oldCorrespondence: CorrespondenceEntity,
    triggerUserId: string,
  ) {
    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      checkPermissions: false,
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadClient: true,
      loadParentGroup: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
      loadRootGroupParentDocument: true,
    });

    const changes = await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: correspondenceId,
      entityType: ChangeFeedEntityType.CORRESPONDENCE,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(correspondence.name, oldCorrespondence.name),
        description: this.feedEventChangeDetectionService.change(
          correspondence.description,
          oldCorrespondence.description,
        ),
        contractor: this.feedEventChangeDetectionService.changeForEntity(
          correspondence.contractor,
          oldCorrespondence.contractor,
        ),
        status: this.feedEventChangeDetectionService.change(correspondence.status, oldCorrespondence.status),
        isPrivate: this.feedEventChangeDetectionService.change(correspondence.isPrivate, oldCorrespondence.isPrivate),
        permissions: this.feedEventChangeDetectionService.changeForPermissions(
          correspondence.permissions,
          oldCorrespondence.permissions,
        ),
      },
    });

    const notification = new AppNotification(
      "Обновление корреспонденции",
      {
        name: correspondence.name,
        id: correspondence.id,
        updatedAt: correspondence.updatedAt,
      },
      { emailTemplateName: "CorrespondenceUpdated" },
      correspondence.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(correspondence.author.id);

    if (changes.permissions?.to)
      await Promise.all(changes.permissions.to.map((changePermission) => notifyUser(changePermission.userId)));

    await this.handleCorrespondencePermissionsNotify(correspondence, notifyUser);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(CorrespondenceCreated.eventName, (event: CorrespondenceCreated) =>
      this.handleCorrespondenceCreated(event.correspondenceId, event.triggerUserId).catch((e) =>
        this.sentryTextService.error(e, {
          context: CorrespondenceCreated.eventName,
          contextService: CorrespondenceEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(CorrespondenceDeleted.eventName, (event: CorrespondenceDeleted) =>
      this.handleCorrespondenceDeleted(event.correspondenceId).catch((e) =>
        this.sentryTextService.error(e, {
          context: CorrespondenceDeleted.eventName,
          contextService: CorrespondenceEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(CorrespondenceUpdated.eventName, (event: CorrespondenceUpdated) =>
      this.handleCorrespondenceUpdated(event.correspondenceId, event.oldCorrespondence, event.triggerUserId).catch(
        (e) =>
          this.sentryTextService.error(e, {
            context: CorrespondenceUpdated.eventName,
            contextService: CorrespondenceEventListenerService.name,
          }),
      ),
    );
  }
}
