import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { GetDocumentRevisionService } from "modules/document-revisions";

@Injectable()
export class GetDocumentRevisionCommentsListService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
  ) {}

  async getCommentsListOrFail(
    revisionId: string,
    {
      showUnresolved,
      ...options
    }: {
      showUnresolved?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
      loadFiles?: boolean;
    } = {},
  ) {
    await this.getDocumentRevisionService.getRevisionOrFail(revisionId);

    const currentUser = getCurrentUser();

    const where: FindOptionsWhere<DocumentRevisionCommentEntity> = {
      revision: {
        id: revisionId,
        document: { client: { id: currentUser.clientId } },
      },
    };

    if (showUnresolved) {
      where.resolved = false;
    }

    const comments = await this.commentsRepository.find({
      where,
      relations: {
        revision: {
          document: {
            client: true,
          },
        },
        author: options.loadAuthor ? { avatar: options.loadAuthorAvatar } : undefined,
        files: options.loadFiles ? { file: true } : undefined,
      },
      order: { createdAt: "ASC" },
    });

    comments.forEach((comment) => comment.calculateAllCans(currentUser));

    return comments;
  }
}
