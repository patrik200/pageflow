import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType } from "@app/shared-enums";
import { SentryTextService } from "@app/back-kit";

import { ProjectEntity } from "entities/Project";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { AppNotification, NotificationService } from "modules/notifications";

import { GetProjectService } from "../projects/get";
import { ProjectCreated } from "../../events/ProjectCreated";
import { ProjectDeleted } from "../../events/ProjectDeleted";
import { ProjectUpdated } from "../../events/ProjectUpdated";

@Injectable()
export class ProjectEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => DeleteChangeFeedEventService))
    private deleteChangeFeedEventService: DeleteChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private sentryTextService: SentryTextService,
  ) {}

  @Transactional()
  private async handleProjectCreated(projectId: string, triggerUserId: string) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      loadClient: true,
      checkPermissions: false,
      loadPermissions: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: project.id,
      entityType: ChangeFeedEntityType.PROJECT,
      eventType: "created",
      data: {
        name: project.name,
      },
    });

    const notification = new AppNotification(
      "Создан новый проект",
      {
        name: project.name,
        id: project.id,
        authorName: project.author.name,
        createdAt: project.createdAt,
      },
      { emailTemplateName: "ProjectCreated" },
      project.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);
    if (project.responsible) await notifyUser(project.responsible.id);
    await Promise.all(project.permissions!.map((permission) => notifyUser(permission.user.id)));
  }

  @Transactional()
  private async handleProjectDeleted(projectId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: projectId,
      entityType: ChangeFeedEntityType.PROJECT,
    });
  }

  @Transactional()
  private async handleProjectUpdated(projectId: string, oldProject: ProjectEntity, triggerUserId: string) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      checkPermissions: false,
      loadPreview: true,
      loadPermissions: true,
      loadClient: true,
    });

    const changes = await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: projectId,
      entityType: ChangeFeedEntityType.PROJECT,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(project.name, oldProject.name),
        description: this.feedEventChangeDetectionService.change(project.description, oldProject.description),
        status: this.feedEventChangeDetectionService.change(project.status, oldProject.status),
        isPrivate: this.feedEventChangeDetectionService.change(project.isPrivate, oldProject.isPrivate),
        startDatePlan: this.feedEventChangeDetectionService.change(project.startDatePlan, oldProject.startDatePlan),
        endDatePlan: this.feedEventChangeDetectionService.change(project.endDatePlan, oldProject.endDatePlan),
        startDateForecast: this.feedEventChangeDetectionService.change(
          project.startDateForecast,
          oldProject.startDateForecast,
        ),
        endDateForecast: this.feedEventChangeDetectionService.change(
          project.endDateForecast,
          oldProject.endDateForecast,
        ),
        startDateFact: this.feedEventChangeDetectionService.change(project.startDateFact, oldProject.startDateFact),
        endDateFact: this.feedEventChangeDetectionService.change(project.endDateFact, oldProject.endDateFact),
        notifyInDays: this.feedEventChangeDetectionService.change(project.notifyInDays, oldProject.notifyInDays),
        preview: this.feedEventChangeDetectionService.changeForFile(project.preview, oldProject.preview),
        responsible: this.feedEventChangeDetectionService.changeForEntity(project.responsible, oldProject.responsible),
        contractor: this.feedEventChangeDetectionService.changeForEntity(project.contractor, oldProject.contractor),
        permissions: this.feedEventChangeDetectionService.changeForPermissions(
          project.permissions,
          oldProject.permissions,
        ),
      },
    });

    const notification = new AppNotification(
      "Проект обновлен",
      {
        name: project.name,
        id: project.id,
        updatedAt: project.updatedAt,
      },
      { emailTemplateName: "ProjectUpdated" },
      project.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    await notifyUser(project.author.id);
    if (changes.responsible?.to) await notifyUser(changes.responsible.to);
    await Promise.all(project.permissions!.map((permission) => notifyUser(permission.user.id)));
    if (changes.permissions) {
      await Promise.all(changes.permissions.to.map((changePermission) => notifyUser(changePermission.userId)));
    }
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(ProjectCreated.eventName, (event: ProjectCreated) =>
      this.handleProjectCreated(event.projectId, event.triggerUserId).catch((e) =>
        this.sentryTextService.error(e, {
          context: ProjectCreated.eventName,
          contextService: ProjectEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(ProjectDeleted.eventName, (event: ProjectDeleted) =>
      this.handleProjectDeleted(event.projectId).catch((e) =>
        this.sentryTextService.error(e, {
          context: ProjectDeleted.eventName,
          contextService: ProjectEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(ProjectUpdated.eventName, (event: ProjectUpdated) =>
      this.handleProjectUpdated(event.projectId, event.oldProject, event.triggerUserId).catch((e) =>
        this.sentryTextService.error(e, {
          context: ProjectUpdated.eventName,
          contextService: ProjectEventListenerService.name,
        }),
      ),
    );
  }
}
