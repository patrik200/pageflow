import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse, ServiceError, StorageFileDTO } from "@app/back-kit";

import { ResponseIdDTO } from "constants/ResponseId";

import { getCurrentUser, withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { CreateTicketCommentsService } from "../services/comment/create";
import { DeleteTicketCommentsService } from "../services/comment/delete";
import { EditTicketCommentsService } from "../services/comment/edit";
import { GetTicketCommentsListService } from "../services/comment/get-list";
import { DeleteTicketCommentFilesService } from "../services/file/delete";
import { EditTicketCommentFilesService } from "../services/file/edit";

import { ResponseTicketCommentsListDTO } from "../dto/get/TicketComment";
import { RequestCreateTicketCommentDTO } from "../dto/edit/CreateTicketComment";
import { RequestUpdateTicketCommentDTO } from "../dto/edit/UpdateTicketComment";

@Controller("tickets")
export class TicketCommentsController {
  constructor(
    private getCommentsListService: GetTicketCommentsListService,
    private createCommentsService: CreateTicketCommentsService,
    private editCommentsService: EditTicketCommentsService,
    private deleteCommentsService: DeleteTicketCommentsService,
    private editCommentFilesService: EditTicketCommentFilesService,
    private deleteCommentFilesService: DeleteTicketCommentFilesService,
  ) {}

  @Get(":ticketId/comments")
  @withUserAuthorized([UserRole.USER])
  async commentsList(@Param("ticketId") ticketId: string) {
    const comments = await this.getCommentsListService.getCommentsListOrFail(ticketId, {
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
    });

    return new ControllerResponse(ResponseTicketCommentsListDTO, { list: comments });
  }

  @Post(":ticketId/comments")
  @withUserAuthorized([UserRole.USER])
  async createComment(@Param("ticketId") ticketId: string, @Body() body: RequestCreateTicketCommentDTO) {
    const commentId = await this.createCommentsService.createCommentOrFail(ticketId, {
      text: body.text,
      authorId: getCurrentUser().userId,
      replyForCommentId: undefined,
    });

    return new ControllerResponse(ResponseIdDTO, { id: commentId });
  }

  @Patch("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async updateComment(@Param("commentId") commentId: string, @Body() body: RequestUpdateTicketCommentDTO) {
    await this.editCommentsService.updateCommentOrFail(commentId, {
      text: body.text,
      isPartOfTransaction: body.isPartOfTransaction,
    });
  }

  @Delete("comments/:commentId")
  @withUserAuthorized([UserRole.USER])
  async deleteComment(@Param("commentId") commentId: string) {
    await this.deleteCommentsService.deleteCommentOrFail(commentId);
  }

  @Post("comments/:commentId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadCommentFile(@Param("commentId") commentId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.editCommentFilesService.uploadCommentFileOrFail(commentId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete("comments/:commentId/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteCommentFile(@Param("commentId") commentId: string, @Param("fileId") fileId: string) {
    await this.deleteCommentFilesService.deleteCommentFileOrFail(commentId, fileId);
  }
}
