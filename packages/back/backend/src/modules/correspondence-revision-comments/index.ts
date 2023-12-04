import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceRevisionCommentFileEntity } from "entities/Correspondence/Correspondence/Revision/Comment/File";

import { CorrespondenceRevisionCommentController } from "./controllers";

import { CreateCorrespondenceRevisionCommentsService } from "./services/comments/create";
import { DeleteCorrespondenceRevisionCommentsService } from "./services/comments/delete";
import { EditCorrespondenceRevisionCommentsService } from "./services/comments/edit";
import { GetCorrespondenceRevisionCommentService } from "./services/comments/get";
import { GetCorrespondenceRevisionCommentsListService } from "./services/comments/get-list";
import { DeleteCorrespondenceRevisionCommentFilesService } from "./services/files/delete";
import { UploadCorrespondenceRevisionCommentFilesService } from "./services/files/upload";
import { CorrespondenceRevisionCommentEventListenerService } from "./services/background/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorrespondenceRevisionEntity,
      CorrespondenceRevisionCommentEntity,
      CorrespondenceEntity,
      CorrespondenceRevisionCommentFileEntity,
    ]),
  ],
  controllers: [CorrespondenceRevisionCommentController],
  providers: [
    CreateCorrespondenceRevisionCommentsService,
    DeleteCorrespondenceRevisionCommentsService,
    EditCorrespondenceRevisionCommentsService,
    GetCorrespondenceRevisionCommentService,
    GetCorrespondenceRevisionCommentsListService,
    DeleteCorrespondenceRevisionCommentFilesService,
    UploadCorrespondenceRevisionCommentFilesService,
    CorrespondenceRevisionCommentEventListenerService,
  ],
  exports: [
    CreateCorrespondenceRevisionCommentsService,
    DeleteCorrespondenceRevisionCommentsService,
    EditCorrespondenceRevisionCommentsService,
    GetCorrespondenceRevisionCommentService,
    GetCorrespondenceRevisionCommentsListService,
    DeleteCorrespondenceRevisionCommentFilesService,
    UploadCorrespondenceRevisionCommentFilesService,
  ],
})
export class CorrespondenceRevisionCommentsModule {}

export * from "./services/comments/create";
export * from "./services/comments/delete";
export * from "./services/comments/edit";
export * from "./services/comments/get";
export * from "./services/comments/get-list";
export * from "./services/files/delete";
export * from "./services/files/upload";
