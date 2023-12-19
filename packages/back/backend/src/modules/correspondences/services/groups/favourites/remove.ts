import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceGroupFavouriteEntity } from "entities/Correspondence/Group/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveCorrespondenceGroupFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private groupRepository: Repository<CorrespondenceGroupEntity>,
    @InjectRepository(CorrespondenceGroupFavouriteEntity)
    private favouriteRepository: Repository<CorrespondenceGroupFavouriteEntity>,
  ) {}

  @Transactional()
  async removeGroupFavouriteOrFail(groupId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const groupFindOptions: FindOptionsWhere<CorrespondenceGroupEntity> = { id: groupId };
    const favouriteFindOptions: FindOptionsWhere<CorrespondenceGroupFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    groupFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const revision = await this.groupRepository.findOneOrFail({
      where: groupFindOptions,
    });

    favouriteFindOptions.group = { id: revision.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
