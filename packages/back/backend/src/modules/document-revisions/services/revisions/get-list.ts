import { Injectable } from "@nestjs/common";
import { convertSortingToTypeOrm } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Not, Repository } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";

import { GetDocumentRevisionIsFavouritesService } from "../favourites/get-is-favourite";
import { DocumentRevisionSorting } from "../../types";

@Injectable()
export class GetDocumentRevisionsListService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private getDocumentRevisionIsFavouritesService: GetDocumentRevisionIsFavouritesService,
  ) {}

  async getRevisionsListOrFail(
    documentId: string,
    {
      loadFavourites,
      showArchived,
      sorting,
      ...options
    }: {
      loadFavourites?: boolean;
      showArchived?: boolean;
      sorting?: DocumentRevisionSorting;
      loadAuthorAvatar?: boolean;
    },
  ) {
    const currentUser = getCurrentUser();
    const findOptions: FindManyOptions<DocumentRevisionEntity> = {
      where: { document: { id: documentId, client: { id: currentUser.clientId } } },
      order: convertSortingToTypeOrm(sorting, { author: "name" }),
      relations: {
        author: {
          avatar: options.loadAuthorAvatar,
        },
        document: {
          client: true,
        },
        comments: true,
        responsibleUserApproving: {
          user: true,
        },
        responsibleUserFlowApproving: {
          rows: {
            users: {
              user: true,
            },
          },
          reviewer: {
            user: true,
          },
        },
      },
    };

    if (!showArchived)
      (findOptions.where as FindOptionsWhere<DocumentRevisionEntity>).status = Not(
        In([DocumentRevisionStatus.ARCHIVE, DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_ARCHIVE]),
      );

    const revisions = await this.revisionsRepository.find(findOptions);

    if (loadFavourites) {
      await Promise.all(
        revisions.map(
          async (revision) =>
            (revision.favourite = await this.getDocumentRevisionIsFavouritesService.getRevisionIsFavourite(
              revision.id,
            )),
        ),
      );
    }

    revisions.forEach((revision) => revision.calculateAllCans(currentUser));

    return revisions;
  }

  async dangerGetRevisionsList(findOptions: FindManyOptions<DocumentRevisionEntity>) {
    return await this.revisionsRepository.find(findOptions);
  }
}
