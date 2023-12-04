import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceFavouriteEntity } from "entities/Correspondence/Correspondence/Favourite";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetCorrespondenceIsFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceFavouriteEntity)
    private correspondenceFavouriteRepository: Repository<CorrespondenceFavouriteEntity>,
  ) {}

  async getCorrespondenceIsFavourite(correspondenceId: string) {
    const favourite = await this.correspondenceFavouriteRepository.findOne({
      where: { correspondence: { id: correspondenceId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadCorrespondenceIsFavourite(correspondence: CorrespondenceEntity) {
    correspondence.favourite = await this.getCorrespondenceIsFavourite(correspondence.id);
    return correspondence;
  }
}
