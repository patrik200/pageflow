import { filterHtml } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { GetDocumentRevisionCommentForEditService } from "./get-for-edit";
import { DocumentRevisionCommentUpdated } from "../../events/CommentUpdated";

interface UpdateCommentData {
  text?: string;
  isPartOfTransaction: boolean;
}

@Injectable()
export class EditDocumentRevisionCommentsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    private getDocumentRevisionCommentForUpdateService: GetDocumentRevisionCommentForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateCommentOrFail(commentId: string, data: UpdateCommentData) {
    const comment = await this.getDocumentRevisionCommentForUpdateService.getCommentForUpdateOrFail(commentId);

    await this.commentsRepository.update(
      comment.id,
      Object.assign(
        {},
        data.isPartOfTransaction ? undefined : { updated: true },
        data.text ? { text: filterHtml(data.text) } : undefined,
      ),
    );

    this.eventEmitter.emit(DocumentRevisionCommentUpdated.eventName, new DocumentRevisionCommentUpdated(comment.id));
  }
}
