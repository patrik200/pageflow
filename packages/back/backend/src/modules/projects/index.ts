import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectEntity } from "entities/Project";
import { ProjectFavouriteEntity } from "entities/Project/Favourite";

import { ProjectsController } from "./controllers";
import { ProjectFavouritesController } from "./controllers/favourites";
import { ProjectsMembersController } from "./controllers/members";

import { AddProjectFavouritesService } from "./services/favorite/add";
import { GetProjectIsFavouritesService } from "./services/favorite/get-is-favorite";
import { GetProjectFavouritesListService } from "./services/favorite/get-list";
import { RemoveProjectFavouritesService } from "./services/favorite/remove";
import { InitElasticProjectsService } from "./services/init";
import { DeleteProjectPreviewService } from "./services/preview/delete";
import { EditProjectPreviewService } from "./services/preview/update";
import { CreateProjectService } from "./services/projects/create";
import { CreateProjectElasticService } from "./services/projects/create-elastic";
import { DeleteProjectService } from "./services/projects/delete";
import { EditProjectService } from "./services/projects/edit";
import { GetProjectService } from "./services/projects/get";
import { GetProjectListService } from "./services/projects/get-list";
import { CompleteProjectsService } from "./services/projects/complete";
import { ProjectAutoArchiverService } from "./services/background/auto-archiver";
import { ProjectNotifyEndDatePlanService } from "./services/background/end-date-plan-notifier";
import { ProjectEventListenerService } from "./services/background/event-listener";
import { CreateProjectPermissionsService } from "./services/permissions/create";
import { DeleteProjectPermissionsService } from "./services/permissions/delete";
import { EditProjectPermissionsService } from "./services/permissions/edit";
import { GetProjectPermissionsService } from "./services/permissions/get";
import { GoalModule } from "modules/goals";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ProjectFavouriteEntity]), GoalModule],
  controllers: [ProjectFavouritesController, ProjectsController, ProjectsMembersController],
  providers: [
    AddProjectFavouritesService,
    GetProjectIsFavouritesService,
    GetProjectFavouritesListService,
    RemoveProjectFavouritesService,
    DeleteProjectPreviewService,
    EditProjectPreviewService,
    CreateProjectService,
    CreateProjectElasticService,
    DeleteProjectService,
    EditProjectService,
    GetProjectService,
    GetProjectListService,
    InitElasticProjectsService,
    CompleteProjectsService,
    ProjectAutoArchiverService,
    ProjectNotifyEndDatePlanService,
    ProjectEventListenerService,
    CreateProjectPermissionsService,
    DeleteProjectPermissionsService,
    EditProjectPermissionsService,
    GetProjectPermissionsService,
  ],
  exports: [
    AddProjectFavouritesService,
    GetProjectIsFavouritesService,
    GetProjectFavouritesListService,
    RemoveProjectFavouritesService,
    DeleteProjectPreviewService,
    EditProjectPreviewService,
    CreateProjectService,
    CreateProjectElasticService,
    DeleteProjectService,
    EditProjectService,
    GetProjectService,
    GetProjectListService,
    InitElasticProjectsService,
    CreateProjectPermissionsService,
    DeleteProjectPermissionsService,
    EditProjectPermissionsService,
    GetProjectPermissionsService,
  ],
})
export class ProjectsModule {
  constructor(initElasticProjectsService: InitElasticProjectsService) {
    initElasticProjectsService.appBootstrap();
  }
}

export * from "./services/favorite/add";
export * from "./services/favorite/get-is-favorite";
export * from "./services/favorite/get-list";
export * from "./services/favorite/remove";
export * from "./services/permissions/create";
export * from "./services/permissions/delete";
export * from "./services/permissions/edit";
export * from "./services/permissions/get";
export * from "./services/preview/delete";
export * from "./services/preview/update";
export * from "./services/projects/create";
export * from "./services/projects/create-elastic";
export * from "./services/projects/delete";
export * from "./services/projects/edit";
export * from "./services/projects/get";
export * from "./services/projects/get-list";
export * from "./services/init";
