import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";
import { DocumentRevisionCommentFileEntity } from "entities/Document/Document/Revision/Comment/File";

import { DeleteFileService } from "modules/storage";

import { GetDocumentRevisionCommentForEditService } from "../get-for-edit";
import { DocumentRevisionCommentUpdated } from "../../../events/CommentUpdated";

@Injectable()
export class DeleteDocumentRevisionCommentFilesService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    @InjectRepository(DocumentRevisionCommentFileEntity)
    private commentFilesRepository: Repository<DocumentRevisionCommentFileEntity>,
    private deleteFileService: DeleteFileService,
    private getDocumentRevisionCommentForEditService: GetDocumentRevisionCommentForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteCommentFile(
    fileId: string,
    { checkPermissions = true, emitEvent = true }: { checkPermissions?: boolean; emitEvent?: boolean } = {},
  ) {
    const commentFile = await this.commentFilesRepository.findOneOrFail({
      where: { file: { id: fileId } },
      relations: { comment: true, file: true },
    });
    const comment = await this.getDocumentRevisionCommentForEditService.getCommentForUpdateOrFail(
      commentFile.comment.id,
      { checkPermissions },
    );

    if (checkPermissions) {
      if (!comment.canUpdate)
        throw new ServiceError("author", "У вас нет доступа для редактирования этого комментария");
    }

    await this.commentsRepository.update(comment.id, {});
    await this.commentFilesRepository.delete({ id: commentFile.id });
    await this.deleteFileService.deleteFileOrFail(commentFile.file);

    if (emitEvent)
      this.eventEmitter.emit(DocumentRevisionCommentUpdated.eventName, new DocumentRevisionCommentUpdated(comment.id));
  }
}
