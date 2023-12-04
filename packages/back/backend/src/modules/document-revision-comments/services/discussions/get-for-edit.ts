import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";
import { ServiceError } from "@app/back-kit";

import { DocumentRevisionCommentDiscussionEntity } from "entities/Document/Document/Revision/Discussion";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetDocumentRevisionCommentDiscussionsForEditService {
  constructor(
    @InjectRepository(DocumentRevisionCommentDiscussionEntity)
    private discussionsRepository: Repository<DocumentRevisionCommentDiscussionEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getDiscussionForUpdateOrFail(
    discussionId: string,
    { checkPermissions = true, ...options }: { checkPermissions?: boolean; loadFiles?: boolean } = {},
  ) {
    const currentUser = getCurrentUser();
    const discussion = await this.discussionsRepository.findOneOrFail({
      where: {
        id: discussionId,
        comment: { revision: { document: { client: { id: currentUser.clientId } } } },
      },
      relations: {
        author: true,
        comment: {
          revision: {
            document: {
              client: true,
            },
          },
        },
        files: options.loadFiles ? { file: true } : undefined,
      },
    });

    discussion.calculateAllCans(currentUser);

    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: discussion.comment.revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );

      if (!discussion.canUpdate)
        throw new ServiceError("author", "У вас нет доступа для редактирования этого сообщения");
    }

    return discussion;
  }
}
