import { ExpressMultipartFile, ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";
import { CorrespondenceRevisionCommentFileEntity } from "entities/Correspondence/Correspondence/Revision/Comment/File";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";

import { CorrespondenceRevisionCommentUpdated } from "../../events/CommentUpdated";
import { GetCorrespondenceRevisionCommentService } from "../comments/get";

@Injectable()
export class UploadCorrespondenceRevisionCommentFilesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    @InjectRepository(CorrespondenceRevisionCommentFileEntity)
    private commentFilesRepository: Repository<CorrespondenceRevisionCommentFileEntity>,
    private getCommentService: GetCorrespondenceRevisionCommentService,
    private uploadFileService: UploadFileService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async uploadCommentFile(commentId: string, file: ExpressMultipartFile) {
    const comment = await this.getCommentService.getCommentOrFail(commentId);
    if (!comment.canUpdate) throw new ServiceError("author", "У вас нет доступа для редактирования этого комментария");

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.correspondences`,
      file,
    );

    await this.commentsRepository.update(comment.id, {});

    const savedCommentFile = await this.commentFilesRepository.save({
      comment: { id: comment.id },
      file: { id: uploadedFile.id },
    });

    this.eventEmitter.emit(
      CorrespondenceRevisionCommentUpdated.eventName,
      new CorrespondenceRevisionCommentUpdated(comment.id),
    );

    return { id: savedCommentFile.id, file: uploadedFile };
  }
}
