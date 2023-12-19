import { ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";

import { GetCorrespondenceRevisionCommentService } from "./get";
import { DeleteCorrespondenceRevisionCommentFilesService } from "../files/delete";
import { CorrespondenceRevisionCommentDeleted } from "../../events/CommentDeleted";

@Injectable()
export class DeleteCorrespondenceRevisionCommentsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    private getCommentService: GetCorrespondenceRevisionCommentService,
    private eventEmitter: EventEmitter2,
    private deleteCorrespondenceRevisionCommentFilesService: DeleteCorrespondenceRevisionCommentFilesService,
  ) {}

  @Transactional()
  async deleteCommentOrFail(
    commentId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const comment = await this.getCommentService.getCommentOrFail(commentId, {
      loadFiles: true,
      checkPermissions,
    });

    if (checkPermissions) {
      if (!comment.canUpdate) throw new ServiceError("author", "У вас нет доступа для удаления этого комментария");
    }

    await Promise.all(
      comment.files.map((commentFile) =>
        this.deleteCorrespondenceRevisionCommentFilesService.deleteCommentFile(commentFile.file.id, {
          checkPermissions,
          emitEvents: false,
        }),
      ),
    );

    await this.commentsRepository.delete(comment.id);

    if (emitEvents)
      this.eventEmitter.emit(
        CorrespondenceRevisionCommentDeleted.eventName,
        new CorrespondenceRevisionCommentDeleted(comment.id),
      );
  }
}
