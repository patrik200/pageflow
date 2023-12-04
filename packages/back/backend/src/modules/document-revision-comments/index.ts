import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";
import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionCommentFileEntity } from "entities/Document/Document/Revision/Comment/File";
import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";
import { DocumentRevisionCommentDiscussionFileEntity } from "entities/Document/Document/Revision/Discussion/File";

import { DocumentRevisionCommentsController } from "./controllers";

import { CreateDocumentRevisionCommentsService } from "./services/comments/create";
import { DeleteDocumentRevisionCommentsService } from "./services/comments/delete";
import { EditDocumentRevisionCommentsService } from "./services/comments/edit";
import { DeleteDocumentRevisionCommentFilesService } from "./services/comments/files/delete";
import { UploadDocumentRevisionCommentFilesService } from "./services/comments/files/upload";
import { GetDocumentRevisionCommentsService } from "./services/comments/get";
import { GetDocumentRevisionCommentForEditService } from "./services/comments/get-for-edit";
import { GetDocumentRevisionCommentsListService } from "./services/comments/get-list";
import { ResolveDocumentRevisionCommentsService } from "./services/comments/resolve";
import { CreateDocumentRevisionCommentDiscussionsService } from "./services/discussions/create";
import { DeleteDocumentRevisionCommentDiscussionsService } from "./services/discussions/delete";
import { EditDocumentRevisionCommentDiscussionsService } from "./services/discussions/edit";
import { DeleteDocumentRevisionCommentDiscussionFilesService } from "./services/discussions/files/delete";
import { UploadDocumentRevisionCommentDiscussionFilesService } from "./services/discussions/files/upload";
import { GetDocumentRevisionCommentDiscussionsService } from "./services/discussions/get";
import { GetDocumentRevisionCommentDiscussionsForEditService } from "./services/discussions/get-for-edit";
import { GetDocumentRevisionCommentDiscussionsListService } from "./services/discussions/get-list";
import { DocumentRevisionCommentEventListenerService } from "./services/comments/background/event-listener";
import { DocumentRevisionDiscussionEventListenerService } from "./services/discussions/background/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentRevisionCommentEntity,
      DocumentRevisionEntity,
      DocumentRevisionCommentFileEntity,
      DocumentRevisionCommentDiscussionEntity,
      DocumentRevisionCommentDiscussionFileEntity,
    ]),
  ],
  controllers: [DocumentRevisionCommentsController],
  providers: [
    DeleteDocumentRevisionCommentFilesService,
    UploadDocumentRevisionCommentFilesService,
    CreateDocumentRevisionCommentsService,
    DeleteDocumentRevisionCommentsService,
    EditDocumentRevisionCommentsService,
    GetDocumentRevisionCommentsService,
    GetDocumentRevisionCommentForEditService,
    GetDocumentRevisionCommentsListService,
    ResolveDocumentRevisionCommentsService,
    DeleteDocumentRevisionCommentDiscussionFilesService,
    UploadDocumentRevisionCommentDiscussionFilesService,
    CreateDocumentRevisionCommentDiscussionsService,
    DeleteDocumentRevisionCommentDiscussionsService,
    EditDocumentRevisionCommentDiscussionsService,
    GetDocumentRevisionCommentDiscussionsService,
    GetDocumentRevisionCommentDiscussionsForEditService,
    GetDocumentRevisionCommentDiscussionsListService,
    DocumentRevisionCommentEventListenerService,
    DocumentRevisionDiscussionEventListenerService,
  ],
  exports: [
    DeleteDocumentRevisionCommentFilesService,
    UploadDocumentRevisionCommentFilesService,
    CreateDocumentRevisionCommentsService,
    DeleteDocumentRevisionCommentsService,
    EditDocumentRevisionCommentsService,
    GetDocumentRevisionCommentsService,
    GetDocumentRevisionCommentsListService,
    ResolveDocumentRevisionCommentsService,
    DeleteDocumentRevisionCommentDiscussionFilesService,
    UploadDocumentRevisionCommentDiscussionFilesService,
    CreateDocumentRevisionCommentDiscussionsService,
    DeleteDocumentRevisionCommentDiscussionsService,
    EditDocumentRevisionCommentDiscussionsService,
    GetDocumentRevisionCommentDiscussionsService,
    GetDocumentRevisionCommentDiscussionsListService,
  ],
})
export class DocumentRevisionCommentsModule {}

export * from "./services/comments/files/delete";
export * from "./services/comments/files/upload";
export * from "./services/comments/create";
export * from "./services/comments/delete";
export * from "./services/comments/edit";
export * from "./services/comments/get";
export * from "./services/comments/get-list";
export * from "./services/comments/resolve";
export * from "./services/discussions/files/delete";
export * from "./services/discussions/files/upload";
export * from "./services/discussions/create";
export * from "./services/discussions/delete";
export * from "./services/discussions/edit";
export * from "./services/discussions/get";
export * from "./services/discussions/get-list";
