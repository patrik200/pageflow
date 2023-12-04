import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionCommentEntity } from "entities/Document/Document/Revision/Comment";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetDocumentRevisionCommentForEditService {
  constructor(
    @InjectRepository(DocumentRevisionCommentEntity)
    private commentsRepository: Repository<DocumentRevisionCommentEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getCommentForUpdateOrFail(
    commentId: string,
    {
      checkPermissions = true,
      ...options
    }: { checkPermissions?: boolean; loadFiles?: boolean; loadDiscussions?: boolean } = {},
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
        author: true,
        files: options.loadFiles ? { file: true } : undefined,
        discussions: options.loadDiscussions,
      },
    });

    comment.calculateAllCans(currentUser);
    comment.revision.calculateCanEditComment();

    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: comment.revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );

      if (!comment.canUpdate || !comment.revision.canEditComments)
        throw new ServiceError("author", "У вас нет доступа для редактирования этого сообщения");
    }

    return comment;
  }
}
