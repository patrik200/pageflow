import { ControllerResponse, ServiceError, StorageFileDTO } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteCorrespondenceRevisionFilesService } from "../services/files/delete";
import { UploadCorrespondenceRevisionFilesService } from "../services/files/upload";
import { ActiveCorrespondenceRevisionsService } from "../services/statuses/active";
import { ArchiveCorrespondenceRevisionsService } from "../services/statuses/archive";
import { CreateCorrespondenceRevisionsService } from "../services/revisions/create";
import { DeleteCorrespondenceRevisionsService } from "../services/revisions/delete";
import { EditCorrespondenceRevisionsService } from "../services/revisions/edit";
import { GetCorrespondenceRevisionService } from "../services/revisions/get";
import { GetCorrespondenceRevisionsListService } from "../services/revisions/get-list";

import { RequestCreateCorrespondenceRevisionDTO } from "../dto/edit/CreateCorrespondenceRevision";
import { RequestUpdateCorrespondenceRevisionDTO } from "../dto/edit/UpateCorrespondenceRevision";
import {
  RequestGetCorrespondenceRevisionsDTO,
  ResponseCorrespondenceRevisionDetailDTO,
  ResponseCorrespondenceRevisionsListDTO,
} from "../dto/get/CorrespondenceRevision";

@Controller("correspondence-revisions")
export class CorrespondenceRevisionsController {
  constructor(
    private createRevisionsService: CreateCorrespondenceRevisionsService,
    private getRevisionsListService: GetCorrespondenceRevisionsListService,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    private editRevisionsService: EditCorrespondenceRevisionsService,
    private deleteRevisionsService: DeleteCorrespondenceRevisionsService,
    private uploadRevisionFilesService: UploadCorrespondenceRevisionFilesService,
    private deleteRevisionFilesService: DeleteCorrespondenceRevisionFilesService,
    private archiveRevisionsService: ArchiveCorrespondenceRevisionsService,
    private activeRevisionsService: ActiveCorrespondenceRevisionsService,
  ) {}

  @Post("correspondence/:correspondenceId/revisions")
  @withUserAuthorized([UserRole.USER])
  async createRevision(
    @Param("correspondenceId") correspondenceId: string,
    @Body() body: RequestCreateCorrespondenceRevisionDTO,
  ) {
    const revisionId = await this.createRevisionsService.createRevisionOrFail(correspondenceId, {
      number: body.number,
    });

    return new ControllerResponse(ResponseIdDTO, { id: revisionId });
  }

  @Get("correspondence/:correspondenceId/revisions")
  @withUserAuthorized([UserRole.USER])
  async getRevisions(
    @Param("correspondenceId") correspondenceId: string,
    @Query() query: RequestGetCorrespondenceRevisionsDTO,
  ) {
    const revisions = await this.getRevisionsListService.getRevisionsListOrFail(correspondenceId, {
      sorting: query.sorting,
      showArchived: query.showArchived,
      loadFavourites: true,
      loadAuthor: true,
      loadAuthorAvatar: true,
    });

    return new ControllerResponse(ResponseCorrespondenceRevisionsListDTO, { list: revisions });
  }

  @Get(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async getRevisionDetail(@Param("revisionId") revisionId: string) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      loadFavourites: true,
      calculateParentGroupPath: true,
      loadAuthorAvatar: true,
      loadFiles: true,
      loadComments: true,
      loadCorrespondenceAuthor: true,
      loadCorrespondenceParentGroup: true,
      loadCorrespondenceRootGroup: true,
      loadCorrespondenceRootGroupParentProject: true,
      loadCorrespondenceRootGroupParentDocument: true,
    });

    return new ControllerResponse(ResponseCorrespondenceRevisionDetailDTO, revision);
  }

  @Patch(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async updateRevision(@Param("revisionId") revisionId: string, @Body() body: RequestUpdateCorrespondenceRevisionDTO) {
    await this.editRevisionsService.updateRevisionOrFail(revisionId, {
      number: body.number,
    });
  }

  @Delete(":revisionId")
  @withUserAuthorized([UserRole.USER])
  async deleteRevision(@Param("revisionId") revisionId: string) {
    await this.deleteRevisionsService.deleteRevisionOrFail(revisionId);
  }

  @Post(":revisionId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadRevisionFile(@Param("revisionId") revisionId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadRevisionFilesService.uploadFileOrFail(revisionId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete(":revisionId/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteRevisionFile(@Param("revisionId") revisionId: string, @Param("fileId") fileId: string) {
    await this.deleteRevisionFilesService.deleteFileOrFail(revisionId, fileId);
  }

  @Post(":revisionId/archive")
  @withUserAuthorized([UserRole.USER])
  async archiveRevision(@Param("revisionId") revisionId: string) {
    await this.archiveRevisionsService.archiveRevisionOrFail(revisionId);
  }

  @Post(":revisionId/active")
  @withUserAuthorized([UserRole.USER])
  async activeRevision(@Param("revisionId") revisionId: string) {
    await this.activeRevisionsService.activeRevisionOrFail(revisionId);
  }
}
