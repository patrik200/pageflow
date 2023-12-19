import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceRevisionFavouriteEntity } from "entities/Correspondence/Correspondence/Revision/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveCorrespondenceRevisionFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceRevisionFavouriteEntity)
    private favouriteRepository: Repository<CorrespondenceRevisionFavouriteEntity>,
  ) {}

  @Transactional()
  async removeFavouriteOrFail(revisionId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const revisionFindOptions: FindOptionsWhere<CorrespondenceRevisionEntity> = { id: revisionId };
    const favouriteFindOptions: FindOptionsWhere<CorrespondenceRevisionFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    revisionFindOptions.correspondence = { client: { id: currentUser.clientId } };

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
