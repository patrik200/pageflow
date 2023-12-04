import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Query } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse, ExpressMultipartFile, ServiceError, StorageFileDTO } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { CreateDocumentRevisionCommentsService } from "../services/comments/create";
import { DeleteDocumentRevisionCommentsService } from "../services/comments/delete";
import { EditDocumentRevisionCommentsService } from "../services/comments/edit";
import { DeleteDocumentRevisionCommentFilesService } from "../services/comments/files/delete";
import { UploadDocumentRevisionCommentFilesService } from "../services/comments/files/upload";
import { GetDocumentRevisionCommentsService } from "../services/comments/get";
import { GetDocumentRevisionCommentsListService } from "../services/comments/get-list";
import { ResolveDocumentRevisionCommentsService } from "../services/comments/resolve";
import { CreateDocumentRevisionCommentDiscussionsService } from "../services/discussions/create";
import { DeleteDocumentRevisionCommentDiscussionsService } from "../services/discussions/delete";
import { EditDocumentRevisionCommentDiscussionsService } from "../services/discussions/edit";
import { DeleteDocumentRevisionCommentDiscussionFilesService } from "../services/discussions/files/delete";
import { UploadDocumentRevisionCommentDiscussionFilesService } from "../services/discussions/files/upload";
import { GetDocumentRevisionCommentDiscussionsService } from "../services/discussions/get";
import { GetDocumentRevisionCommentDiscussionsListService } from "../services/discussions/get-list";

import {
  ResponseDocumentRevisionCommentDTO,
  ResponseDocumentRevisionCommentListDTO,
} from "../dto/get/DocumentRevisionComment";
import {
  ResponseDocumentRevisionCommentDiscussionDTO,
  ResponseDocumentRevisionCommentDiscussionsListDTO,
} from "../dto/get/DocumentRevisionCommentDiscussion";
import { RequestCreateDocumentRevisionCommentDTO } from "../dto/edit/CreateDocumentRevisionComment";
import { RequestUpdateDocumentRevisionCommentDTO } from "../dto/edit/UpdateDocumentRevisionComment";
import { RequestCreateDocumentRevisionCommentDiscussionDTO } from "../dto/edit/CreateDocumentRevisionCommentDiscussion";
import { RequestUpdateDocumentRevisionCommentDiscussionDTO } from "../dto/edit/UpdateDocumentRevisionCommentDiscussion";

@Controller("document-revision")
export class DocumentRevisionCommentsController {
  constructor(
    private getCommentsService: GetDocumentRevisionCommentsService,
    private editCommentsService: EditDocumentRevisionCommentsService,
    private deleteCommentsService: DeleteDocumentRevisionCommentsService,
    private uploadCommentFilesService: UploadDocumentRevisionCommentFilesService,
    private deleteCommentFilesService: DeleteDocumentRevisionCommentFilesService,
    private resolveCommentsService: ResolveDocumentRevisionCommentsService,
    private getDiscussionsListService: GetDocumentRevisionCommentDiscussionsListService,
    private getCommentsListService: GetDocumentRevisionCommentsListService,
    private createDiscussionsService: CreateDocumentRevisionCommentDiscussionsService,
    private getDiscussionsService: GetDocumentRevisionCommentDiscussionsService,
    private editDiscussionsService: EditDocumentRevisionCommentDiscussionsService,
    private deleteDiscussionsService: DeleteDocumentRevisionCommentDiscussionsService,
    private uploadDiscussionFilesService: UploadDocumentRevisionCommentDiscussionFilesService,
    private deleteDiscussionFilesService: DeleteDocumentRevisionCommentDiscussionFilesService,
    private createCommentsService: CreateDocumentRevisionCommentsService,
  ) {}

  @Patch("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async updateComment(@Param("commentId") commentId: string, @Body() body: RequestUpdateDocumentRevisionCommentDTO) {
    await this.editCommentsService.updateCommentOrFail(commentId, {
      text: body.text,
      isPartOfTransaction: body.isPartOfTransaction,
    });

    const comment = await this.getCommentsService.getCommentOrFail(commentId, {
      loadAuthorAvatar: true,
      loadFiles: true,
    });
    return new ControllerResponse(ResponseDocumentRevisionCommentDTO, comment);
  }

  @Delete("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async deleteComment(@Param("commentId") commentId: string) {
    await this.deleteCommentsService.deleteComment(commentId);
  }

  @Post("comments/:commentId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadCommentFile(@Param("commentId") commentId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadCommentFilesService.uploadCommentFile(commentId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete("comments/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteCommentFile(@Param("fileId") fileId: string) {
    await this.deleteCommentFilesService.deleteCommentFile(fileId);
  }

  @Post("comments/:commentId/resolve")
  @withUserAuthorized([UserRole.USER])
  async resolveComment(@Param("commentId") commentId: string) {
    await this.resolveCommentsService.resolveCommentOrFail(commentId);
  }

  @Get("comments/:commentId/discussions")
  @withUserAuthorized([UserRole.USER])
  async getDiscussions(@Param("commentId") commentId: string) {
    const discussions = await this.getDiscussionsListService.getDiscussionsListOrFail(commentId, {
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });

    return new ControllerResponse(ResponseDocumentRevisionCommentDiscussionsListDTO, { items: discussions });
  }

  @Post("comments/:commentId/discussions")
  @withUserAuthorized([UserRole.USER])
  async createDiscussion(
    @Param("commentId") commentId: string,
    @Body() body: RequestCreateDocumentRevisionCommentDiscussionDTO,
  ) {
    const discussionId = await this.createDiscussionsService.createDiscussionOrFail(commentId, {
      text: body.text,
    });

    const discussion = await this.getDiscussionsService.getDiscussionOrFail(discussionId, {
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });
    return new ControllerResponse(ResponseDocumentRevisionCommentDiscussionDTO, discussion);
  }

  @Get("discussions/:discussionId")
  @withUserAuthorized([UserRole.USER])
  async getDiscussion(@Param("discussionId") discussionId: string) {
    const discussion = await this.getDiscussionsService.getDiscussionOrFail(discussionId, {
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });
    return new ControllerResponse(ResponseDocumentRevisionCommentDiscussionDTO, discussion);
  }

  @Patch("discussions/:discussionId")
  @withUserAuthorized([UserRole.USER])
  async updateDiscussion(
    @Param("discussionId") discussionId: string,
    @Body() body: RequestUpdateDocumentRevisionCommentDiscussionDTO,
  ) {
    await this.editDiscussionsService.updateDiscussionOrFail(discussionId, {
      text: body.text,
      isPartOfTransaction: body.isPartOfTransaction,
    });

    const discussion = await this.getDiscussionsService.getDiscussionOrFail(discussionId, {
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });
    return new ControllerResponse(ResponseDocumentRevisionCommentDiscussionDTO, discussion);
  }

  @Delete("discussions/:discussionId")
  @withUserAuthorized([UserRole.USER])
  async deleteDiscussion(@Param("discussionId") discussionId: string) {
    await this.deleteDiscussionsService.deleteDiscussion(discussionId);
  }

  @Post("discussions/:discussionId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadDiscussionFile(@Param("discussionId") discussionId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadDiscussionFilesService.uploadDiscussionFile(discussionId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Post("discussions/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteDiscussionFile(@Param("fileId") fileId: string) {
    await this.deleteDiscussionFilesService.deleteDiscussionFile(fileId);
  }

  @Get(":revisionId/comments")
  @withUserAuthorized([UserRole.USER])
  async getComments(@Param("revisionId") revisionId: string, @Query("showUnresolved") showUnresolved: boolean) {
    const comments = await this.getCommentsListService.getCommentsListOrFail(revisionId, {
      showUnresolved,
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });

    return new ControllerResponse(ResponseDocumentRevisionCommentListDTO, { items: comments });
  }

  @Post(":revisionId/comments")
  @withUserAuthorized([UserRole.USER])
  async createComment(
    @Param("revisionId") revisionId: string,
    @Body() body: RequestCreateDocumentRevisionCommentDTO,
    @Req() req: BaseExpressRequest,
  ) {
    const files = Object.values(req.files) as ExpressMultipartFile[];
    const commentId = await this.createCommentsService.createCommentOrFail(revisionId, {
      text: body.text,
      files,
    });
    const comment = await this.getCommentsService.getCommentOrFail(commentId, {
      loadAuthorAvatar: true,
      loadFiles: true,
    });
    return new ControllerResponse(ResponseDocumentRevisionCommentDTO, comment);
  }
}
