import { ElasticService } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { DeleteCorrespondenceRevisionCommentsService } from "modules/correspondence-revision-comments";
import { PermissionAccessService } from "modules/permissions";

import { RemoveCorrespondenceRevisionFavouritesService } from "../favourites/remove";
import { DeleteCorrespondenceRevisionFilesService } from "../files/delete";
import { GetCorrespondenceRevisionService } from "./get";
import { CorrespondenceRevisionDeleted } from "../../events/RevisionDeleted";

@Injectable()
export class DeleteCorrespondenceRevisionsService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    private deleteRevisionFilesService: DeleteCorrespondenceRevisionFilesService,
    @Inject(forwardRef(() => DeleteCorrespondenceRevisionCommentsService))
    private deleteCorrespondenceRevisionCommentsService: DeleteCorrespondenceRevisionCommentsService,
    private removeRevisionFavouritesService: RemoveCorrespondenceRevisionFavouritesService,
    private elasticService: ElasticService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async deleteRevisionOrFail(
    revisionId: string,
    { checkPermissions = true, emitEvents = true }: { checkPermissions?: boolean; emitEvents?: boolean } = {},
  ) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      checkPermissions,
      loadFiles: true,
      loadComments: true,
    });

    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );
    }

    await Promise.all([
      ...revision.files.map(({ file }) =>
        this.deleteRevisionFilesService.deleteFileOrFail(revision.id, file.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
      ...revision.comments.map((comment) =>
        this.deleteCorrespondenceRevisionCommentsService.deleteCommentOrFail(comment.id, {
          checkPermissions: false,
          emitEvents: false,
        }),
      ),
      this.removeRevisionFavouritesService.removeFavouriteOrFail(revision.id, { forAllUsers: true }),
    ]);

    await this.revisionRepository.delete(revision.id);

    await this.elasticService.deleteIndexDocumentOrFail(
      this.elasticService.getDocumentId("correspondence-revisions", revision.id),
    );

    if (emitEvents)
      this.eventEmitter.emit(CorrespondenceRevisionDeleted.eventName, new CorrespondenceRevisionDeleted(revision.id));
  }
}
