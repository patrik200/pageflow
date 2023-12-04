import { ExpressMultipartFile, filterHtml, ServiceError } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { GetDocumentRevisionService } from "modules/document-revisions";

import { UploadDocumentRevisionCommentFilesService } from "./files/upload";
import { DocumentRevisionCommentCreated } from "../../events/CommentCreated";

interface CreateCommentData {
  text: string;
  files?: ExpressMultipartFile[];
}

@Injectable()
export class CreateDocumentRevisionCommentsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
    private uploadDocumentRevisionCommentFilesService: UploadDocumentRevisionCommentFilesService,
  ) {}

  @Transactional()
  async createCommentOrFail(revisionId: string, data: CreateCommentData) {
    const currentUser = getCurrentUser();
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId);
    if (!revision.canEditComments) throw new ServiceError("status", "Нельзя создать комментарий");

    const comment = await this.commentsRepository.save({
      revision: { id: revision.id },
      author: { id: currentUser.userId },
      text: filterHtml(data.text),
      resolved: false,
      updated: false,
    });

    await Promise.all(
      data.files?.map((file) => this.uploadDocumentRevisionCommentFilesService.uploadCommentFile(comment.id, file)) ??
        [],
    );

    this.eventEmitter.emit(DocumentRevisionCommentCreated.eventName, new DocumentRevisionCommentCreated(comment.id));

    return comment.id;
  }
}
