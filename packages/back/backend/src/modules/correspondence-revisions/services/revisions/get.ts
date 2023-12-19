import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionIsFavouritesService } from "../favourites/get-is-favourite";

@Injectable()
export class GetCorrespondenceRevisionService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionsRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceGroupEntity) private groupsRepository: Repository<CorrespondenceGroupEntity>,
    private getRevisionIsFavouritesService: GetCorrespondenceRevisionIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getRevisionOrFail(
    revisionId: string,
    {
      calculateParentGroupPath,
      loadFavourites,
      checkPermissions = true,
      ...options
    }: {
      calculateParentGroupPath?: boolean;
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadFiles?: boolean;
      loadComments?: boolean;
      loadAuthorAvatar?: boolean;
      loadCorrespondenceAuthor?: boolean;
      loadCorrespondenceParentGroup?: boolean;
      loadCorrespondenceRootGroup?: boolean;
      loadCorrespondenceRootGroupParentProject?: boolean;
      loadCorrespondenceRootGroupParentDocument?: boolean;
    } = {},
  ) {
    const findOptions: FindOptionsWhere<CorrespondenceRevisionEntity> = { id: revisionId };
    findOptions.correspondence = { client: { id: getCurrentUser().clientId } };

    const revision = await this.revisionsRepository.findOneOrFail({
      where: findOptions,
      relations: {
        correspondence: {
          client: true,
          author: options.loadCorrespondenceAuthor,
          parentGroup: options.loadCorrespondenceParentGroup,
          rootGroup: options.loadCorrespondenceRootGroup
            ? {
                parentProject: options.loadCorrespondenceRootGroupParentProject,
                parentDocument: options.loadCorrespondenceRootGroupParentDocument,
              }
            : false,
        },
        author: {
          avatar: options.loadAuthorAvatar,
        },
        files: options.loadFiles ? { file: true } : false,
        comments: options.loadComments,
      },
    });

    if (checkPermissions)
      await this.permissionAccessService.validateToRead(
        { entityId: revision.correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );

    revision.calculateAllCans(getCurrentUser());

    await Promise.all([
      calculateParentGroupPath && revision.correspondence.parentGroup?.calculateGroupsPath(this.groupsRepository),
      loadFavourites && this.getRevisionIsFavouritesService.loadRevisionIsFavourite(revision),
    ]);

    return revision;
  }
}
