import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { GetDocumentRevisionService } from "modules/document-revisions";

@Injectable()
export class GetDocumentRevisionCommentsService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
  ) {}

  async getCommentOrFail(
    commentId: string,
    {
      checkPermissions = true,
      ...options
    }: {
      checkPermissions?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
      loadRevisionAuthor?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();
    const comment = await this.commentsRepository.findOneOrFail({
      where: {
        id: commentId,
        revision: { document: { client: { id: currentUser.clientId } } },
      },
      relations: {
        revision: {
          document: {
            client: true,
          },
        },
        author: {
          avatar: options.loadAuthorAvatar,
        },
        files: options.loadFiles ? { file: true } : undefined,
      },
    });

    await this.getDocumentRevisionService.getRevisionOrFail(comment.revision.id, { checkPermissions });

    comment.calculateAllCans(currentUser);

    return comment;
  }
}
