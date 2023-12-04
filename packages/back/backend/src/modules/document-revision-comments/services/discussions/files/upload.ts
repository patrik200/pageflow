import { Injectable } from "@nestjs/common";
import { ExpressMultipartFile } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";
import { DocumentRevisionCommentDiscussionFileEntity } from "entities/Document/Document/Revision/Discussion/File";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";

import { GetDocumentRevisionCommentDiscussionsForEditService } from "../get-for-edit";
import { DocumentRevisionDiscussionUpdated } from "../../../events/DiscussionUpdated";

@Injectable()
export class UploadDocumentRevisionCommentDiscussionFilesService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    @InjectRepository(DocumentRevisionCommentDiscussionFileEntity)
    private discussionFilesRepository: Repository<DocumentRevisionCommentDiscussionFileEntity>,
    private uploadFileService: UploadFileService,
    private getDocumentRevisionCommentDiscussionsForEditService: GetDocumentRevisionCommentDiscussionsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async uploadDiscussionFile(discussionId: string, file: ExpressMultipartFile) {
    const discussion = await this.getDocumentRevisionCommentDiscussionsForEditService.getDiscussionForUpdateOrFail(
      discussionId,
    );

    await this.discussionsRepository.update(discussion.id, {});

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.documents`,
      file,
    );

    const savedDiscussionFile = await this.discussionFilesRepository.save({
      discussion: { id: discussion.id },
      file: { id: uploadedFile.id },
    });

    this.eventEmitter.emit(
      DocumentRevisionDiscussionUpdated.eventName,
      new DocumentRevisionDiscussionUpdated(discussion.id),
    );

    return { id: savedDiscussionFile.id, file: uploadedFile };
  }
}
