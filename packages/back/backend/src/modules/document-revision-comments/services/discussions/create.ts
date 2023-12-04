import { filterHtml } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { getCurrentUser } from "modules/auth";

import { GetDocumentRevisionCommentsService } from "../comments/get";
import { DocumentRevisionDiscussionCreated } from "../../events/DiscussionCreated";

interface CreateDiscussionData {
  text: string;
}

@Injectable()
export class CreateDocumentRevisionCommentDiscussionsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    private eventEmitter: EventEmitter2,
    private getDocumentRevisionCommentsService: GetDocumentRevisionCommentsService,
  ) {}

  @Transactional()
  async createDiscussionOrFail(commentId: string, data: CreateDiscussionData) {
    const comment = await this.getDocumentRevisionCommentsService.getCommentOrFail(commentId);
    const discussion = await this.discussionsRepository.save({
      comment: { id: comment.id },
      author: { id: getCurrentUser().userId },
      text: filterHtml(data.text),
      updated: false,
    });

    this.eventEmitter.emit(
      DocumentRevisionDiscussionCreated.eventName,
      new DocumentRevisionDiscussionCreated(discussion.id),
    );

    return discussion.id;
  }
}
