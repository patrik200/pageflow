import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceRevisionFavouriteEntity } from "entities/Correspondence/Correspondence/Revision/Favourite";
import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetCorrespondenceRevisionIsFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionFavouriteEntity)
    private favouriteRepository: Repository<CorrespondenceRevisionFavouriteEntity>,
  ) {}

  async getRevisionIsFavourite(revisionId: string) {
    const favourite = await this.favouriteRepository.findOne({
      where: { revision: { id: revisionId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadRevisionIsFavourite(revision: CorrespondenceRevisionEntity) {
    revision.favourite = await this.getRevisionIsFavourite(revision.id);
    return revision;
  }
}
