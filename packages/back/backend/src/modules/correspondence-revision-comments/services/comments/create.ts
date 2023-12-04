import { ExpressMultipartFile, filterHtml } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";
import { CorrespondenceRevisionCommentFileEntity } from "entities/Correspondence/Correspondence/Revision/Comment/File";

import { getCurrentUser } from "modules/auth";
import { GetCorrespondenceRevisionService } from "modules/correspondence-revisions";
import { UploadFileService } from "modules/storage";

import { CorrespondenceRevisionCommentCreated } from "../../events/CommentCreated";

interface CreateCommentData {
  text: string;
  files?: ExpressMultipartFile[];
}

@Injectable()
export class CreateCorrespondenceRevisionCommentsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    @InjectRepository(CorrespondenceRevisionCommentFileEntity)
    private commentFilesRepository: Repository<CorrespondenceRevisionCommentFileEntity>,
    @Inject(forwardRef(() => GetCorrespondenceRevisionService))
    private getRevisionsService: GetCorrespondenceRevisionService,
    private uploadFileService: UploadFileService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async createCommentOrFail(revisionId: string, data: CreateCommentData) {
    const revision = await this.getRevisionsService.getRevisionOrFail(revisionId);

    const currentUser = getCurrentUser();

    const savedComment = await this.commentsRepository.save({
      revision: { id: revision.id },
      author: { id: currentUser.userId },
      text: filterHtml(data.text),
    });

    await Promise.all(
      data.files?.map(async (file) => {
        const { id: fileId } = await this.uploadFileService.uploadFileOrFail(
          `client.${currentUser.clientId}.documents`,
          file,
        );

        return await this.commentFilesRepository.save({
          comment: { id: savedComment.id },
          file: { id: fileId },
        });
      }) ?? [],
    );

    this.eventEmitter.emit(
      CorrespondenceRevisionCommentCreated.eventName,
      new CorrespondenceRevisionCommentCreated(savedComment.id),
    );

    return savedComment.id;
  }
}
