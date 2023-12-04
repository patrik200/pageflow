import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { getCurrentUser } from "modules/auth";

import { GetDocumentRevisionCommentsService } from "../comments/get";

@Injectable()
export class GetDocumentRevisionCommentDiscussionsListService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    private getDocumentRevisionCommentsService: GetDocumentRevisionCommentsService,
  ) {}

  async getDiscussionsListOrFail(
    commentId: string,
    options: {
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();
    const comment = await this.getDocumentRevisionCommentsService.getCommentOrFail(commentId);

    const discussions = await this.discussionsRepository.find({
      where: {
        comment: {
          id: comment.id,
          revision: { document: { client: { id: currentUser.clientId } } },
        },
      },
      order: { createdAt: "ASC" },
      relations: {
        comment: {
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

    discussions.forEach((discussion) => discussion.calculateAllCans(currentUser));

    return discussions;
  }
}
