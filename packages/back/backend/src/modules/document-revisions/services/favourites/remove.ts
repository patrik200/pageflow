import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFavouriteEntity } from "entities/Document/Document/Revision/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveDocumentRevisionFavouritesService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionFavouriteEntity)
    private favouriteRepository: Repository<DocumentRevisionFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(revisionId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const revisionFindOptions: FindOptionsWhere<DocumentRevisionEntity> = { id: revisionId };
    const favouriteFindOptions: FindOptionsWhere<DocumentRevisionFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    revisionFindOptions.document = { client: { id: currentUser.clientId } };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const revision = await this.revisionRepository.findOneOrFail({
      where: revisionFindOptions,
    });

    favouriteFindOptions.revision = { id: revision.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
