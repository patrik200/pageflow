import { ControllerResponse, ExpressMultipartFile, ServiceError, StorageFileDTO } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { CreateCorrespondenceRevisionCommentsService } from "../services/comments/create";
import { DeleteCorrespondenceRevisionCommentsService } from "../services/comments/delete";
import { EditCorrespondenceRevisionCommentsService } from "../services/comments/edit";
import { GetCorrespondenceRevisionCommentsListService } from "../services/comments/get-list";
import { DeleteCorrespondenceRevisionCommentFilesService } from "../services/files/delete";
import { UploadCorrespondenceRevisionCommentFilesService } from "../services/files/upload";
import { GetCorrespondenceRevisionCommentService } from "../services/comments/get";

import {
  ResponseCorrespondenceRevisionCommentDTO,
  ResponseCorrespondenceRevisionCommentListDTO,
} from "../dto/get/CorrespondenceRevisionComment";
import { RequestCreateCorrespondenceRevisionCommentDTO } from "../dto/edit/CreateCorrespondenceRevisionComment";
import { RequestUpdateCorrespondenceRevisionCommentDTO } from "../dto/edit/UpateCorrespondenceRevisionComment";

@Controller("correspondence-revision")
export class CorrespondenceRevisionCommentController {
  constructor(
    private getRevisionCommentsListService: GetCorrespondenceRevisionCommentsListService,
    private getRevisionCommentService: GetCorrespondenceRevisionCommentService,
    private createRevisionCommentsService: CreateCorrespondenceRevisionCommentsService,
    private editRevisionCommentsService: EditCorrespondenceRevisionCommentsService,
    private deleteRevisionCommentsService: DeleteCorrespondenceRevisionCommentsService,
    private uploadRevisionCommentFilesService: UploadCorrespondenceRevisionCommentFilesService,
    private deleteRevisionCommentFilesService: DeleteCorrespondenceRevisionCommentFilesService,
  ) {}

  @Get(":revisionId/comments")
  @withUserAuthorized([UserRole.USER])
  async getComments(@Param("revisionId") revisionId: string) {
    const comments = await this.getRevisionCommentsListService.getCommentsListOrFail(revisionId, {
      loadFiles: true,
      loadAuthorAvatar: true,
    });
    return new ControllerResponse(ResponseCorrespondenceRevisionCommentListDTO, { items: comments });
  }

  @Post(":revisionId/comments")
  @withUserAuthorized([UserRole.USER])
  async createComment(
    @Param("revisionId") revisionId: string,
    @Body() body: RequestCreateCorrespondenceRevisionCommentDTO,
    @Req() req: BaseExpressRequest,
  ) {
    const files = Object.values(req.files) as ExpressMultipartFile[];
    const commentId = await this.createRevisionCommentsService.createCommentOrFail(revisionId, {
      text: body.text,
      files,
    });

    const comment = await this.getRevisionCommentService.getCommentOrFail(commentId, {
      loadAuthorAvatar: true,
      loadFiles: true,
    });

    return new ControllerResponse(ResponseCorrespondenceRevisionCommentDTO, comment);
  }

  @Patch("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async updateComment(
    @Param("commentId") commentId: string,
    @Body() body: RequestUpdateCorrespondenceRevisionCommentDTO,
  ) {
    await this.editRevisionCommentsService.updateCommentOrFail(commentId, {
      text: body.text,
      isPartOfTransaction: body.isPartOfTransaction,
    });

    const comment = await this.getRevisionCommentService.getCommentOrFail(commentId, {
      loadAuthorAvatar: true,
      loadFiles: true,
    });

    return new ControllerResponse(ResponseCorrespondenceRevisionCommentDTO, comment);
  }

  @Delete("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async deleteComment(@Param("commentId") commentId: string) {
    await this.deleteRevisionCommentsService.deleteCommentOrFail(commentId);
  }

  @Post("comments/:commentId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadCommentFile(@Param("commentId") commentId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadRevisionCommentFilesService.uploadCommentFile(commentId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete("comments/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteCommentFile(@Param("fileId") fileId: string) {
    await this.deleteRevisionCommentFilesService.deleteCommentFile(fileId);
  }
}
