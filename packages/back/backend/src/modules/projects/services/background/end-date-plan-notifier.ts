import { errorLogBeautifier, INTLService, INTLServiceLang } from "@app/back-kit";
import { config } from "@app/core-config";
import { ProjectsStatus } from "@app/shared-enums";
import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isDateBefore, setAsyncInterval } from "@worksolutions/utils";
import { IsNull, Not, Repository } from "typeorm";
import chalk from "chalk";
import { DateTime } from "luxon";

import { ProjectEntity } from "entities/Project";

import { AppNotification, NotificationService } from "modules/notifications";

import { GetProjectListService } from "../projects/get-list";
import { GetProjectService } from "../projects/get";

@Injectable()
export class ProjectNotifyEndDatePlanService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private getProjectListService: GetProjectListService,
    private getProjectService: GetProjectService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
  ) {}

  private loggerContext = "Project notify end date plan";

  private async notifyProjectByNotifyInDays(projectId: string) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      unsafeIgnoreClient: true,
      checkPermissions: false,
      loadPermissions: true,
      loadClient: true,
    });

    const needNotifyIn = DateTime.fromJSDate(project.endDatePlan!).minus({ day: project.notifyInDays! });
    const now = this.intlService.getCurrentDateTime();
    if (isDateBefore({ value: now, comparisonWith: needNotifyIn })) return;
    await this.projectRepository.update(project.id, { notifiedInDays: true });
    const notification = new AppNotification(
      "Приближается дата планового завершения проекта",
      {
        name: project.name,
        id: project.id,
        deadlineAt: project.createdAt,
      },
      { emailTemplateName: "ProjectEndDateNotified" },
      project.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification);
    await notifyUser(project.author.id);
    if (project.responsible) await notifyUser(project.responsible.id);
    await Promise.all(project.permissions!.map((permission) => notifyUser(permission.user.id)));
  }

  private async notifyProjectByAfterEndDatePlan(projectId: string) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      unsafeIgnoreClient: true,
      checkPermissions: false,
      loadPermissions: true,
      loadClient: true,
    });

    const needNotifyIn = DateTime.fromJSDate(project.endDatePlan!);
    const now = this.intlService.getCurrentDateTime();
    if (isDateBefore({ value: now, comparisonWith: needNotifyIn })) return;
    await this.projectRepository.update(project.id, { notifiedAfterEndDatePlan: true });
    const notification = new AppNotification(
      "Плановая дата завершения проекта прошла",
      {
        name: project.name,
        id: project.id,
        deadlineAt: project.createdAt,
      },
      { emailTemplateName: "ProjectEndDateOverdue" },
      project.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification);
    await notifyUser(project.author.id);
    if (project.responsible) await notifyUser(project.responsible.id);
    await Promise.all(project.permissions!.map((permission) => notifyUser(permission.user.id)));
  }

  private async checkProjects() {
    const projectsNotNotifiedInDays = await this.getProjectListService.dangerGetProjectsList({
      where: {
        notifiedInDays: false,
        status: ProjectsStatus.IN_PROGRESS,
        notifyInDays: Not(IsNull()),
        endDatePlan: Not(IsNull()),
      },
    });

    const projectsNotNotifiedAfterEndDatePlan = await this.getProjectListService.dangerGetProjectsList({
      where: {
        notifiedAfterEndDatePlan: false,
        status: ProjectsStatus.IN_PROGRESS,
        endDatePlan: Not(IsNull()),
      },
    });

    for (const project of projectsNotNotifiedInDays) {
      try {
        await this.notifyProjectByNotifyInDays(project.id);
      } catch (e) {
        Logger.error(`Error while notify project ${project.id}:`, this.loggerContext);
        errorLogBeautifier(e);
      }
    }

    for (const project of projectsNotNotifiedAfterEndDatePlan) {
      try {
        await this.notifyProjectByAfterEndDatePlan(project.id);
      } catch (e) {
        Logger.error(`Error while notify project ${project.id}:`, this.loggerContext);
        errorLogBeautifier(e);
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkProjects();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.projects.endDatePlanCheckIntervalMs}ms`)}]`,
      this.loggerContext,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkProjects(), config.projects.endDatePlanCheckIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
