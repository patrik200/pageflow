import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { typeormAlias } from "@app/back-kit";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFavouriteEntity } from "entities/Document/Document/Revision/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetDocumentRevisionFavouritesListService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionFavouriteEntity)
    private favouriteRepository: Repository<DocumentRevisionFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getFavouritesOrFail(options: { loadAuthorAvatar?: boolean } = {}) {
    const currentUser = getCurrentUser();
    const favourites = await this.favouriteRepository.find({
      where: { user: { id: currentUser.userId } },
      relations: { revision: true },
    });

    const revisions = await this.revisionRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.revision.id)) },
      join: {
        alias: typeormAlias,
        innerJoinAndSelect: {
          author: typeormAlias + ".author",
        },
        leftJoinAndSelect: {
          comments: typeormAlias + ".comments",
        },
      },
      relations: {
        document: true,
        author: {
          avatar: options.loadAuthorAvatar,
        },
      },
    });

    revisions.forEach((revision) => revision.calculateAllCans(currentUser));

    const revisionsWithPermissions = await Promise.all(
      revisions.map(async (revision) => ({
        revision,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
          false,
        ),
      })),
    );

    return revisionsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ revision }) => revision);
  }
}
