import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { getCurrentUser } from "modules/auth";
import { GetDocumentRevisionService } from "modules/document-revisions";

@Injectable()
export class GetDocumentRevisionCommentDiscussionsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
  ) {}

  async getDiscussionOrFail(
    discussionId: string,
    {
      checkPermissions = true,
      ...options
    }: {
      checkPermissions?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
      loadCommentAuthor?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();
    const discussion = await this.discussionsRepository.findOneOrFail({
      where: {
        id: discussionId,
        comment: {
          revision: { document: { client: { id: currentUser.clientId } } },
        },
      },
      relations: {
        comment: {
          author: options.loadCommentAuthor,
          revision: {
            document: {
              client: true,
            },
          },
        },
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : undefined,
        files: options.loadFiles ? { file: true } : undefined,
      },
    });

    await this.getDocumentRevisionService.getRevisionOrFail(discussion.comment.revision.id, { checkPermissions });

    discussion.calculateAllCans(currentUser);

    return discussion;
  }
}
