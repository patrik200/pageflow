import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceRevisionFavouriteEntity } from "entities/Correspondence/Correspondence/Revision/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddCorrespondenceRevisionFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    @InjectRepository(CorrespondenceRevisionFavouriteEntity)
    private favouriteRepository: Repository<CorrespondenceRevisionFavouriteEntity>,
  ) {}

  @Transactional()
  async addFavouriteOrFail(revisionId: string) {
    const { clientId, userId } = getCurrentUser();
    const revision = await this.revisionRepository.findOneOrFail({
      withDeleted: true,
      where: { id: revisionId, correspondence: { client: { id: clientId } } },
      relations: { correspondence: true },
    });
    await this.favouriteRepository.save({ revision: { id: revision.id }, user: { id: userId } });
  }
}
