import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDeleted } from "modules/document-revision-comments/events/CommentDeleted";
import { DocumentRevisionCommentResolved } from "modules/document-revision-comments/events/CommentResolved";

import { ApproveDocumentRevisionStatusesService } from "../statuses/approve";

@Injectable()
export class DocumentRevisionAutoResolveByCommentsListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private approveDocumentRevisionStatusesService: ApproveDocumentRevisionStatusesService,
  ) {}

  onApplicationBootstrap() {
    this.eventEmitter.addListener(DocumentRevisionCommentDeleted.eventName, (event: DocumentRevisionCommentDeleted) =>
      this.approveDocumentRevisionStatusesService.tryToApproveRevisionOrFail(event.revisionId),
    );
    this.eventEmitter.addListener(DocumentRevisionCommentResolved.eventName, (event: DocumentRevisionCommentResolved) =>
      this.approveDocumentRevisionStatusesService.tryToApproveRevisionOrFail(event.revisionId),
    );
  }
}
