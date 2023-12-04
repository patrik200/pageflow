import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { GetCorrespondenceRevisionService } from "modules/correspondence-revisions";

@Injectable()
export class GetCorrespondenceRevisionCommentService {
  constructor(
    @InjectRepository(CorrespondenceRevisionCommentEntity)
    private commentsRepository: Repository<CorrespondenceRevisionCommentEntity>,
    @Inject(forwardRef(() => GetCorrespondenceRevisionService))
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
  ) {}

  async getCommentOrFail(
    commentId: string,
    {
      checkPermissions = true,
      ...options
    }: {
      checkPermissions?: boolean;
      loadFiles?: boolean;
      loadAuthorAvatar?: boolean;
      loadRevisionAuthor?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();

    const comment = await this.commentsRepository.findOneOrFail({
      where: {
        id: commentId,
        revision: {
          correspondence: {
            client: { id: currentUser.clientId },
          },
        },
      },
      relations: {
        author: {
          avatar: options.loadAuthorAvatar,
        },
        revision: {
          author: options.loadRevisionAuthor,
          correspondence: {
            client: true,
          },
        },
        files: options.loadFiles ? { file: true } : false,
      },
    });

    await this.getCorrespondenceRevisionService.getRevisionOrFail(comment.revision.id, { checkPermissions });

    comment.calculateAllCans(currentUser);

    return comment;
  }
}
