import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentFavouriteEntity } from "entities/Document/Document/Favourite";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

@Injectable()
export class GetDocumentFavouritesListService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentFavouriteEntity)
    private documentFavouriteRepository: Repository<DocumentFavouriteEntity>,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async getDocumentFavouritesOrFail(
    options: { loadDocumentAuthor?: boolean; loadDocumentAuthorAvatar?: boolean } = {},
  ) {
    const favourites = await this.documentFavouriteRepository.find({
      where: { user: { id: getCurrentUser().userId } },
      relations: {
        document: true,
      },
    });

    const documents = await this.documentRepository.find({
      withDeleted: true,
      where: { id: In(favourites.map((favourite) => favourite.document.id)) },
      relations: {
        author: options.loadDocumentAuthor
          ? {
              avatar: options.loadDocumentAuthorAvatar,
            }
          : false,
      },
    });

    const documentsWithPermissions = await Promise.all(
      documents.map(async (document) => ({
        document,
        hasAccess: await this.permissionAccessService.validateToRead(
          { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
          false,
        ),
      })),
    );

    return documentsWithPermissions.filter(({ hasAccess }) => hasAccess).map(({ document }) => document);
  }
}
