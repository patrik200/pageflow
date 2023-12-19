import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceFavouriteEntity } from "entities/Correspondence/Correspondence/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveCorrespondenceFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(CorrespondenceFavouriteEntity)
    private correspondenceFavouriteRepository: Repository<CorrespondenceFavouriteEntity>,
  ) {}

  @Transactional()
  async removeCorrespondenceFavouriteOrFail(correspondenceId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const correspondenceFindOptions: FindOptionsWhere<CorrespondenceEntity> = { id: correspondenceId };
    const favouriteFindOptions: FindOptionsWhere<CorrespondenceFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    correspondenceFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const correspondence = await this.correspondenceRepository.findOneOrFail({
      where: correspondenceFindOptions,
    });

    favouriteFindOptions.correspondence = { id: correspondence.id };

    await this.correspondenceFavouriteRepository.delete(favouriteFindOptions);
  }
}
