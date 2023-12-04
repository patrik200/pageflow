import { errorLogBeautifier, INTLService, INTLServiceLang } from "@app/back-kit";
import { config } from "@app/core-config";
import { ChangeFeedEntityType, ProjectsStatus } from "@app/shared-enums";
import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { setAsyncInterval } from "@worksolutions/utils";
import { LessThanOrEqual, Repository } from "typeorm";
import chalk from "chalk";

import { ProjectEntity } from "entities/Project";

import { ChangeFeedEventChangeDetectionService, CreateChangeFeedEventService } from "modules/change-feed";

import { GetProjectListService } from "../projects/get-list";

@Injectable()
export class ProjectAutoArchiverService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private getProjectListService: GetProjectListService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
  ) {}

  private loggerContext = "Project auto archiver";

  private async checkProject(project: ProjectEntity) {
    await this.projectRepository.update(project.id, { status: ProjectsStatus.ARCHIVE });
    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: project.id,
      entityType: ChangeFeedEntityType.PROJECT,
      eventType: "updated",
      data: {
        status: this.feedEventChangeDetectionService.change(ProjectsStatus.ARCHIVE, project.status),
      },
    });
  }

  private async archiveProject() {
    const autoArchivePeriodDate = this.intlService
      .getCurrentDateTime()
      .minus({ day: config.projects.autoArchiveAfterDays })
      .toJSDate();

    const projects = await this.getProjectListService.dangerGetProjectsList({
      where: { status: ProjectsStatus.COMPLETED, updatedAt: LessThanOrEqual(autoArchivePeriodDate) },
    });

    for (const project of projects) {
      try {
        await this.checkProject(project);
      } catch (e) {
        Logger.error(`Error while check project:`, this.loggerContext);
        errorLogBeautifier(e);
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.archiveProject();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.projects.autoArchiveCheckIntervalMs}ms`)}]`,
      this.loggerContext,
    );
    this.disposeTimer = setAsyncInterval(() => this.archiveProject(), config.projects.autoArchiveCheckIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
