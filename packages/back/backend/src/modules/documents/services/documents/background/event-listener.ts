import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType, PermissionEntityType } from "@app/shared-enums";

import { DocumentEntity } from "entities/Document/Document";
import { UserEntity } from "entities/User";
import { UserFlowEntity } from "entities/UserFlow";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { PermissionAccessService } from "modules/permissions";
import { GetProjectService } from "modules/projects";
import { AppNotification, NotificationService } from "modules/notifications";

import { GetDocumentService } from "../get";
import { GetDocumentGroupService } from "../../groups/get";
import { DocumentCreated } from "../../../events/DocumentCreated";
import { DocumentDeleted } from "../../../events/DocumentDeleted";
import { DocumentUpdated } from "../../../events/DocumentUpdated";

@Injectable()
export class DocumentEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => DeleteChangeFeedEventService))
    private deleteChangeFeedEventService: DeleteChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => GetDocumentGroupService)) private getDocumentGroupService: GetDocumentGroupService,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
  ) {}

  private async handleDocumentPermissionsNotify(
    document: DocumentEntity,
    notifyUser: (userId: string) => Promise<void>,
  ) {
    await Promise.all(document.permissions!.map((permission) => notifyUser(permission.user.id)));
    if (document.responsibleUser) await notifyUser(document.responsibleUser.id);

    if (document.isPrivate) return;

    if (document.parentGroup) {
      const group = await this.getDocumentGroupService.getGroupOrFail(document.parentGroup.id, {
        checkPermissions: false,
        loadPermissions: true,
      });

      if (document.isPrivate) {
        await Promise.all(
          group.permissions!.map(async (groupPermission) => {
            const hasAccess = await this.permissionAccessService.validateToRead(
              { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
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

    if (document.rootGroup.parentProject) {
      const project = await this.getProjectService.getProjectOrFail(document.rootGroup.parentProject.id, {
        checkPermissions: false,
        loadPermissions: true,
      });

      if (project.isPrivate) {
        await Promise.all(
          project.permissions!.map(async (projectPermission) => {
            const hasAccess = await this.permissionAccessService.validateToRead(
              { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
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
  }

  @Transactional()
  private async handleDocumentCreated(documentId: string, triggerUserId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      checkPermissions: false,
      loadType: true,
      loadResponsibleUser: true,
      loadResponsibleUserFlow: true,
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadClient: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: document.id,
      entityType: ChangeFeedEntityType.DOCUMENT,
      eventType: "created",
      data: {
        name: document.name,
      },
    });

    const notification = new AppNotification(
      "Создан новый документ",
      {
        name: document.name,
        id: document.id,
        authorName: document.author.name,
        createdAt: document.createdAt,
      },
      { emailTemplateName: "DocumentCreated" },
      document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await this.handleDocumentPermissionsNotify(document, notifyUser);
  }

  @Transactional()
  private async handleDocumentDeleted(documentId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: documentId,
      entityType: ChangeFeedEntityType.DOCUMENT,
    });
  }

  private changeResponsibleUser(
    newResponsibleUser: UserEntity | null | undefined,
    oldResponsibleUser: UserEntity | null | undefined,
  ) {
    return this.feedEventChangeDetectionService.createEntityChange(newResponsibleUser, oldResponsibleUser, "id", "id");
  }

  private changeResponsibleUserFlow(
    newResponsibleUserFlow: UserFlowEntity | null | undefined,
    oldResponsibleUserFlow: UserFlowEntity | null | undefined,
  ) {
    return this.feedEventChangeDetectionService.createEntityChange(
      newResponsibleUserFlow,
      oldResponsibleUserFlow,
      "id",
      "name",
    );
  }

  @Transactional()
  private async handleDocumentUpdated(documentId: string, oldDocument: DocumentEntity, triggerUserId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      checkPermissions: false,
      loadType: true,
      loadResponsibleUser: true,
      loadResponsibleUserFlow: true,
      loadPermissions: true,
      permissionSelectOptions: { loadUser: true },
      loadClient: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
    });

    const changes = await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: documentId,
      entityType: ChangeFeedEntityType.DOCUMENT,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(document.name, oldDocument.name),
        description: this.feedEventChangeDetectionService.change(document.description, oldDocument.description),
        remarks: this.feedEventChangeDetectionService.change(document.remarks, oldDocument.remarks),
        contractor: this.feedEventChangeDetectionService.changeForEntity(document.contractor, oldDocument.contractor),
        status: this.feedEventChangeDetectionService.change(document.status, oldDocument.status),
        isPrivate: this.feedEventChangeDetectionService.change(document.isPrivate, oldDocument.isPrivate),
        type: this.feedEventChangeDetectionService.changeForDictionary(document.type, oldDocument.type),
        startDatePlan: this.feedEventChangeDetectionService.change(document.startDatePlan, oldDocument.startDatePlan),
        startDateForecast: this.feedEventChangeDetectionService.change(
          document.startDateForecast,
          oldDocument.startDateForecast,
        ),
        startDateFact: this.feedEventChangeDetectionService.change(document.startDateFact, oldDocument.startDateFact),
        endDatePlan: this.feedEventChangeDetectionService.change(document.endDatePlan, oldDocument.endDatePlan),
        endDateForecast: this.feedEventChangeDetectionService.change(
          document.endDateForecast,
          oldDocument.endDateForecast,
        ),
        endDateFact: this.feedEventChangeDetectionService.change(document.endDateFact, oldDocument.endDateFact),
        responsibleUser: this.changeResponsibleUser(document.responsibleUser, oldDocument.responsibleUser),
        responsibleUserFlow: this.changeResponsibleUserFlow(
          document.responsibleUserFlow,
          oldDocument.responsibleUserFlow,
        ),
        permissions: this.feedEventChangeDetectionService.changeForPermissions(
          document.permissions,
          oldDocument.permissions,
        ),
      },
    });

    const notification = new AppNotification(
      "Обновление документа",
      {
        name: document.name,
        id: document.id,
        updatedAt: document.updatedAt,
      },
      { emailTemplateName: "DocumentUpdated" },
      document.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    if (changes.permissions?.to)
      await Promise.all(changes.permissions.to.map((changePermission) => notifyUser(changePermission.userId)));

    await this.handleDocumentPermissionsNotify(document, notifyUser);
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(DocumentCreated.eventName, (event: DocumentCreated) =>
      this.handleDocumentCreated(event.documentId, event.triggerUserId).catch(() => null),
    );
    this.eventEmitter.on(DocumentDeleted.eventName, (event: DocumentDeleted) =>
      this.handleDocumentDeleted(event.documentId).catch(() => null),
    );
    this.eventEmitter.on(DocumentUpdated.eventName, (event: DocumentUpdated) =>
      this.handleDocumentUpdated(event.documentId, event.oldDocument, event.triggerUserId).catch(() => null),
    );
  }
}
