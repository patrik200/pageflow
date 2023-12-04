import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { DeleteDocumentRevisionCommentDiscussionFilesService } from "./files/delete";
import { GetDocumentRevisionCommentDiscussionsForEditService } from "./get-for-edit";
import { DocumentRevisionDiscussionDeleted } from "../../events/DiscussionDeleted";

@Injectable()
export class DeleteDocumentRevisionCommentDiscussionsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    private getDocumentRevisionCommentDiscussionsForEditService: GetDocumentRevisionCommentDiscussionsForEditService,
    private deleteDocumentRevisionCommentDiscussionFilesService: DeleteDocumentRevisionCommentDiscussionFilesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteDiscussion(
    discussionId: string,
    { checkPermissions = true, emitEvent = true }: { checkPermissions?: boolean; emitEvent?: boolean } = {},
  ) {
    const discussion = await this.getDocumentRevisionCommentDiscussionsForEditService.getDiscussionForUpdateOrFail(
      discussionId,
      { checkPermissions, loadFiles: true },
    );

    await Promise.all(
      discussion.files.map((discussionFile) =>
        this.deleteDocumentRevisionCommentDiscussionFilesService.deleteDiscussionFile(discussionFile.file.id, {
          checkPermissions: false,
          emitEvent: false,
        }),
      ),
    );

    await this.discussionsRepository.delete(discussion.id);

    if (emitEvent)
      this.eventEmitter.emit(
        DocumentRevisionDiscussionDeleted.eventName,
        new DocumentRevisionDiscussionDeleted(discussion.id),
      );
  }
}
