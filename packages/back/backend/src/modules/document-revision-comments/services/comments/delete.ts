import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { DeleteDocumentRevisionCommentDiscussionsService } from "../discussions/delete";
import { DeleteDocumentRevisionCommentFilesService } from "./files/delete";
import { GetDocumentRevisionCommentForEditService } from "./get-for-edit";
import { DocumentRevisionCommentDeleted } from "../../events/CommentDeleted";

@Injectable()
export class DeleteDocumentRevisionCommentsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    private deleteDocumentRevisionCommentDiscussionsService: DeleteDocumentRevisionCommentDiscussionsService,
    private getDocumentRevisionCommentForEditService: GetDocumentRevisionCommentForEditService,
    private deleteDocumentRevisionCommentFilesService: DeleteDocumentRevisionCommentFilesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteComment(
    commentId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const comment = await this.getDocumentRevisionCommentForEditService.getCommentForUpdateOrFail(commentId, {
      checkPermissions,
      loadFiles: true,
      loadDiscussions: true,
    });

    await Promise.all(
      comment.discussions.map((discussion) =>
        this.deleteDocumentRevisionCommentDiscussionsService.deleteDiscussion(discussion.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
    );

    await Promise.all(
      comment.files.map((commentFile) =>
        this.deleteDocumentRevisionCommentFilesService.deleteCommentFile(commentFile.file.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
    );

    await this.commentsRepository.delete(comment.id);

    if (emitEvents)
      await this.eventEmitter.emitAsync(
        DocumentRevisionCommentDeleted.eventName,
        new DocumentRevisionCommentDeleted(comment.revision.id, comment.id),
      );
  }
}
