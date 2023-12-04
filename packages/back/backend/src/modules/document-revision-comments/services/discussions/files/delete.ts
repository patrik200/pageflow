import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";
import { DocumentRevisionCommentDiscussionFileEntity } from "entities/Document/Document/Revision/Discussion/File";

import { DeleteFileService } from "modules/storage";

import { GetDocumentRevisionCommentDiscussionsForEditService } from "../get-for-edit";
import { DocumentRevisionDiscussionUpdated } from "../../../events/DiscussionUpdated";

@Injectable()
export class DeleteDocumentRevisionCommentDiscussionFilesService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    @InjectRepository(DocumentRevisionCommentDiscussionFileEntity)
    private discussionFilesRepository: Repository<DocumentRevisionCommentDiscussionFileEntity>,
    private deleteFileService: DeleteFileService,
    private getDocumentRevisionCommentDiscussionsForEditService: GetDocumentRevisionCommentDiscussionsForEditService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async deleteDiscussionFile(
    fileId: string,
    { checkPermissions = true, emitEvent = true }: { checkPermissions?: boolean; emitEvent?: boolean } = {},
  ) {
    const discussionFile = await this.discussionFilesRepository.findOneOrFail({
      where: { file: { id: fileId } },
      relations: { discussion: true, file: true },
    });

    const discussion = await this.getDocumentRevisionCommentDiscussionsForEditService.getDiscussionForUpdateOrFail(
      discussionFile.discussion.id,
      { checkPermissions },
    );

    await this.discussionsRepository.update(discussion.id, {});
    await this.discussionFilesRepository.delete({ id: discussionFile.id });
    await this.deleteFileService.deleteFileOrFail(discussionFile.file);

    if (emitEvent)
      this.eventEmitter.emit(
        DocumentRevisionDiscussionUpdated.eventName,
        new DocumentRevisionDiscussionUpdated(discussion.id),
      );
  }
}
