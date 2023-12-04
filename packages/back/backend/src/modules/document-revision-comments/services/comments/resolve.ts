import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { GetDocumentRevisionCommentForEditService } from "./get-for-edit";
import { DocumentRevisionCommentResolved } from "../../events/CommentResolved";

@Injectable()
export class ResolveDocumentRevisionCommentsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    private getDocumentRevisionCommentForEditService: GetDocumentRevisionCommentForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  async resolveCommentOrFail(commentId: string) {
    const comment = await this.getDocumentRevisionCommentForEditService.getCommentForUpdateOrFail(commentId);
    await this.commentsRepository.update(comment.id, { resolved: true });

    await this.eventEmitter.emitAsync(
      DocumentRevisionCommentResolved.eventName,
      new DocumentRevisionCommentResolved(comment.revision.id, comment.id),
    );
  }
}
