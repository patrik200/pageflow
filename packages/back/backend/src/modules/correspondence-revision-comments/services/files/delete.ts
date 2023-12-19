import { ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";
import { CorrespondenceRevisionCommentFileEntity } from "entities/Correspondence/Correspondence/Revision/Comment/File";

import { DeleteFileService } from "modules/storage";

import { GetCorrespondenceRevisionCommentService } from "../comments/get";
import { CorrespondenceRevisionCommentUpdated } from "../../events/CommentUpdated";

@Injectable()
export class DeleteCorrespondenceRevisionCommentFilesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    @InjectRepository(CorrespondenceRevisionCommentFileEntity)
    private commentFilesRepository: Repository<CorrespondenceRevisionCommentFileEntity>,
    private getCommentService: GetCorrespondenceRevisionCommentService,
    private deleteFileService: DeleteFileService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteCommentFile(
    fileId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const commentFile = await this.commentFilesRepository.findOneOrFail({
      where: { file: { id: fileId } },
      relations: { comment: true, file: true },
    });

    const comment = await this.getCommentService.getCommentOrFail(commentFile.comment.id, { checkPermissions });

    if (checkPermissions) {
      if (!comment.canUpdate)
        throw new ServiceError("author", "У вас нет доступа для редактирования этого комментария");
    }

    await this.commentsRepository.update(comment.id, {});

    await this.commentFilesRepository.delete(commentFile.id);
    await this.deleteFileService.deleteFileOrFail(commentFile.file);

    if (emitEvents)
      this.eventEmitter.emit(
        CorrespondenceRevisionCommentUpdated.eventName,
        new CorrespondenceRevisionCommentUpdated(comment.id),
      );
  }
}
