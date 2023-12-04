import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { GetCorrespondenceRevisionService } from "modules/correspondence-revisions";

@Injectable()
export class GetCorrespondenceRevisionCommentsListService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    @Inject(forwardRef(() => GetCorrespondenceRevisionService))
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
  ) {}

  async getCommentsListOrFail(revisionId: string, options: { loadAuthorAvatar?: boolean; loadFiles?: boolean } = {}) {
    await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId);

    const currentUser = getCurrentUser();

    const comments = await this.commentsRepository.find({
      where: {
        revision: {
          id: revisionId,
          correspondence: {
            client: { id: currentUser.clientId },
          },
        },
      },
      relations: {
        revision: {
          correspondence: {
            client: true,
          },
        },
        author: {
          avatar: options.loadAuthorAvatar,
        },
        files: options.loadFiles ? { file: true } : false,
      },
      order: { createdAt: "ASC" },
    });

    comments.forEach((comment) => comment.calculateAllCans(currentUser));

    return comments;
  }
}
