import { CorrespondenceRevisionStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, In, Not, Repository } from "typeorm";
import { convertSortingToTypeOrm } from "@app/back-kit";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetCorrespondenceRevisionIsFavouritesService } from "../favourites/get-is-favourite";
import { CorrespondenceRevisionSorting } from "../../types";

@Injectable()
export class GetCorrespondenceRevisionsListService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionsRepository: Repository<CorrespondenceRevisionEntity>,
    private getRevisionIsFavouritesService: GetCorrespondenceRevisionIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getRevisionsListOrFail(
    correspondenceId: string,
    {
      sorting,
      showArchived,
      loadFavourites,
      ...options
    }: {
      sorting?: CorrespondenceRevisionSorting;
      showArchived?: boolean;
      loadFavourites?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
    } = {},
  ) {
    await this.permissionAccessService.validateToRead(
      { entityId: correspondenceId, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const currentUser = getCurrentUser();
    const where: FindOptionsWhere<CorrespondenceRevisionEntity> = {
      correspondence: { id: correspondenceId, client: { id: currentUser.clientId } },
    };

    if (!showArchived)
      where.status = Not(
        In([CorrespondenceRevisionStatus.ARCHIVE, CorrespondenceRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE]),
      );

    const revisions = await this.revisionsRepository.find({
      where,
      relations: {
        correspondence: { client: true },
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
      },
      order: convertSortingToTypeOrm(sorting, { author: "name" }),
    });

    if (loadFavourites) {
      await Promise.all(
        revisions.map(
          async (revision) =>
            (revision.favourite = await this.getRevisionIsFavouritesService.getRevisionIsFavourite(revision.id)),
        ),
      );
    }

    revisions.forEach((revision) => revision.calculateAllCans(currentUser));

    return revisions;
  }

  async dangerGetRevisionsList(findOptions: FindManyOptions<CorrespondenceRevisionEntity>) {
    return await this.revisionsRepository.find(findOptions);
  }
}
