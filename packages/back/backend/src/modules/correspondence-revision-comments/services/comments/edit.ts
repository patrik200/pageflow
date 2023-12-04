import { ServiceError, filterHtml } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";

import { GetCorrespondenceRevisionCommentService } from "./get";
import { CorrespondenceRevisionCommentUpdated } from "../../events/CommentUpdated";

interface UpdateCommentData {
  text?: string;
  isPartOfTransaction: boolean;
}

@Injectable()
export class EditCorrespondenceRevisionCommentsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    private getCommentService: GetCorrespondenceRevisionCommentService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateCommentOrFail(commentId: string, data: UpdateCommentData) {
    const originalComment = await this.getCommentService.getCommentOrFail(commentId);

    if (!originalComment.canUpdate)
      throw new ServiceError("author", "У вас нет доступа для редактирования этого комментария");

    await this.commentsRepository.update(
      originalComment.id,
      Object.assign(
        {},
        data.isPartOfTransaction ? undefined : { updated: true },
        data.text ? { text: filterHtml(data.text) } : undefined,
      ),
    );

    this.eventEmitter.emit(
      CorrespondenceRevisionCommentUpdated.eventName,
      new CorrespondenceRevisionCommentUpdated(originalComment.id),
    );
  }
}
