import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TicketCommentEntity } from "entities/Ticket/Comment";
import { TicketCommentFileEntity } from "entities/Ticket/Comment/File";

import { TicketCommentsController } from "./controllers";

import { CreateTicketCommentsService } from "./services/comment/create";
import { DeleteTicketCommentsService } from "./services/comment/delete";
import { EditTicketCommentsService } from "./services/comment/edit";
import { GetTicketCommentsService } from "./services/comment/get";
import { GetTicketCommentsForEditService } from "./services/comment/get-for-edit";
import { GetTicketCommentsListService } from "./services/comment/get-list";
import { DeleteTicketCommentFilesService } from "./services/file/delete";
import { EditTicketCommentFilesService } from "./services/file/edit";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TicketCommentEntity, TicketCommentFileEntity])],
  controllers: [TicketCommentsController],
  providers: [
    CreateTicketCommentsService,
    DeleteTicketCommentsService,
    EditTicketCommentsService,
    GetTicketCommentsService,
    GetTicketCommentsForEditService,
    GetTicketCommentsListService,
    DeleteTicketCommentFilesService,
    EditTicketCommentFilesService,
  ],
  exports: [
    CreateTicketCommentsService,
    DeleteTicketCommentsService,
    EditTicketCommentsService,
    GetTicketCommentsService,
    GetTicketCommentsListService,
    DeleteTicketCommentFilesService,
    EditTicketCommentFilesService,
  ],
})
export class TicketCommentsModule {}

export * from "./services/comment/create";
export * from "./services/comment/delete";
export * from "./services/comment/edit";
export * from "./services/comment/get";
export * from "./services/comment/get-list";
export * from "./services/file/delete";
export * from "./services/file/edit";
