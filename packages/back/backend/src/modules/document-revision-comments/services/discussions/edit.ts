import { filterHtml } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { GetDocumentRevisionCommentDiscussionsForEditService } from "./get-for-edit";
import { DocumentRevisionDiscussionUpdated } from "../../events/DiscussionUpdated";

interface UpdateDiscussionData {
  text?: string;
  isPartOfTransaction: boolean;
}

@Injectable()
export class EditDocumentRevisionCommentDiscussionsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    private getDocumentRevisionCommentDiscussionsForEditService: GetDocumentRevisionCommentDiscussionsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async updateDiscussionOrFail(discussionId: string, data: UpdateDiscussionData) {
    const discussion = await this.getDocumentRevisionCommentDiscussionsForEditService.getDiscussionForUpdateOrFail(
      discussionId,
    );

    await this.discussionsRepository.update(
      discussion.id,
      Object.assign(
        {},
        data.isPartOfTransaction ? undefined : { updated: true },
        data.text ? { text: filterHtml(data.text) } : undefined,
      ),
    );

    this.eventEmitter.emit(
      DocumentRevisionDiscussionUpdated.eventName,
      new DocumentRevisionDiscussionUpdated(discussion.id),
    );
  }
}
