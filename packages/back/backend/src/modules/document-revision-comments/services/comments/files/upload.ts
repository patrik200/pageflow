import { Injectable } from "@nestjs/common";
import { ExpressMultipartFile, ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";
import { DocumentRevisionCommentFileEntity } from "entities/Document/Document/Revision/Comment/File";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";

import { GetDocumentRevisionCommentForEditService } from "../get-for-edit";
import { DocumentRevisionCommentUpdated } from "../../../events/CommentUpdated";

@Injectable()
export class UploadDocumentRevisionCommentFilesService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    @InjectRepository(DocumentRevisionCommentFileEntity)
    private commentFilesRepository: Repository<DocumentRevisionCommentFileEntity>,
    private uploadFileService: UploadFileService,
    private getDocumentRevisionCommentForEditService: GetDocumentRevisionCommentForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async uploadCommentFile(commentId: string, file: ExpressMultipartFile) {
    const comment = await this.getDocumentRevisionCommentForEditService.getCommentForUpdateOrFail(commentId);
    if (!comment.canUpdate) throw new ServiceError("author", "У вас нет доступа для редактирования этого комментария");

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.documents`,
      file,
    );

    await this.commentsRepository.update(comment.id, {});

    const savedCommentFile = await this.commentFilesRepository.save({
      comment: { id: comment.id },
      file: { id: uploadedFile.id },
    });

    this.eventEmitter.emit(DocumentRevisionCommentUpdated.eventName, new DocumentRevisionCommentUpdated(comment.id));

    return { id: savedCommentFile.id, file: uploadedFile };
  }
}
