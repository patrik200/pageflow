import {
  ControllerPaginatedResponse,
  ControllerResponse,
  ServiceError,
  StorageFileDTO,
  withPagination,
} from "@app/back-kit";
import { PaginationQueryInterface } from "@app/kit";
import { UserRole } from "@app/shared-enums";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";

import { ResponseIdDTO } from "constants/ResponseId";

import { getCurrentUser, withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteProjectPreviewService } from "../services/preview/delete";
import { EditProjectPreviewService } from "../services/preview/update";
import { CreateProjectService } from "../services/projects/create";
import { DeleteProjectService } from "../services/projects/delete";
import { EditProjectService } from "../services/projects/edit";
import { GetProjectService } from "../services/projects/get";
import { GetProjectListService } from "../services/projects/get-list";
import { CompleteProjectsService } from "../services/projects/complete";

import { RequestCreateProjectDTO } from "../dto/edit/CreateProject";
import { RequestUpdateProjectDTO } from "../dto/edit/UpdateProject";
import { RequestDeleteProjectDTO } from "../dto/edit/DeleteProject";
import { QueryGetProjectDTO } from "../dto/get/GetProject";
import { ResponseProjectDTO } from "../dto/get/Project";

@Controller("projects")
export class ProjectsController {
  constructor(
    private completeProjectsService: CompleteProjectsService,
    private getProjectService: GetProjectService,
    private getProjectListService: GetProjectListService,
    private createProjectService: CreateProjectService,
    private editProjectService: EditProjectService,
    private deleteProjectService: DeleteProjectService,
    private editProjectPreviewService: EditProjectPreviewService,
    private deleteProjectPreviewService: DeleteProjectPreviewService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getProjects(@withPagination() pagination: PaginationQueryInterface, @Query() query: QueryGetProjectDTO) {
    const projects = await this.getProjectListService.getProjectsListOrFail(
      {
        pagination,
        search: query.search,
        sorting: query.sorting,
        showArchived: query.showArchived,
        responsibleUser: query.responsibleUser,
      },
      {
        loadFavourites: true,
        loadTickets: true,
        loadPreview: true,
        loadResponsible: true,
        loadResponsibleAvatar: true,
        loadContractor: true,
        loadContractorLogo: true,
        loadAuthor: true,
        loadAuthorAvatar: true,
      },
    );

    return new ControllerPaginatedResponse(ResponseProjectDTO, projects);
  }

  @Get(":projectId")
  @withUserAuthorized([UserRole.USER])
  async getProjectById(@Param("projectId") projectId: string) {
    const project = await this.getProjectService.getProjectOrFail(projectId, {
      loadFavourites: true,
      loadActiveTicketsCount: true,
      loadPreview: true,
      loadResponsibleAvatar: true,
      loadContractor: true,
      loadContractorLogo: true,
      loadAuthorAvatar: true,
      loadGoals: true,
    });

    return new ControllerResponse(ResponseProjectDTO, project);
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createProject(@Body() body: RequestCreateProjectDTO) {
    const projectId = await this.createProjectService.createProjectOrFail({
      name: body.name,
      description: body.description,
      contractorId: body.contractorId,
      responsibleId: body.responsibleId,
      startDatePlan: body.startDatePlan,
      startDateForecast: body.startDateForecast,
      startDateFact: body.startDateFact,
      endDatePlan: body.endDatePlan,
      endDateForecast: body.endDateForecast,
      endDateFact: body.endDateFact,
      isPrivate: body.isPrivate,
      authorId: getCurrentUser().userId,
      notifyInDays: body.notifyInDays,
    });

    return new ControllerResponse(ResponseIdDTO, { id: projectId });
  }

  @Patch(":projectId")
  @withUserAuthorized([UserRole.USER])
  async updateProject(@Param("projectId") projectId: string, @Body() body: RequestUpdateProjectDTO) {
    await this.editProjectService.updateProjectOrFail(projectId, body);
  }

  @Post(":projectId/preview")
  @withUserAuthorized([UserRole.USER])
  async updateProjectPreview(@Param("projectId") projectId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const file = await this.editProjectPreviewService.updateProjectPreviewOrFail(projectId, {
      file: req.files.file,
    });

    return new ControllerResponse(StorageFileDTO, file);
  }

  @Post(":projectId/complete")
  @withUserAuthorized([UserRole.USER])
  async completeProject(@Param("projectId") projectId: string) {
    await this.completeProjectsService.completeProjectOrFail(projectId);
  }

  @Delete(":projectId/preview")
  @withUserAuthorized([UserRole.USER])
  async deleteProjectPreview(@Param("projectId") projectId: string) {
    await this.deleteProjectPreviewService.deleteProjectPreviewOrFail(projectId);
  }

  @Delete(":projectId")
  @withUserAuthorized([UserRole.USER])
  async deleteProject(@Param("projectId") projectId: string, @Body() body: RequestDeleteProjectDTO) {
    await this.deleteProjectService.deleteProjectOrFail(projectId, {
      moveDocuments: body.moveDocuments,
      moveCorrespondencesToClient: body.moveCorrespondencesToClient,
    });
  }
}
