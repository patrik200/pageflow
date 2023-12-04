import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceGroupFavouriteEntity } from "entities/Correspondence/Group/Favourite";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetCorrespondenceGroupIsFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceGroupFavouriteEntity)
    private groupFavouriteRepository: Repository<CorrespondenceGroupFavouriteEntity>,
  ) {}

  async getGroupIsFavourite(groupId: string) {
    const favourite = await this.groupFavouriteRepository.findOne({
      where: { group: { id: groupId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadGroupIsFavourite(group: CorrespondenceGroupEntity) {
    group.favourite = await this.getGroupIsFavourite(group.id);
    return group;
  }
}
