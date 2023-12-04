import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    private groupFavouriteRepository: Repository<CorrespondenceGroupFavouriteEntity>,
  ) {}

  @Transactional()
  async removeGroupFavouriteOrFail(groupId: string) {
    const { clientId, userId } = getCurrentUser();
    const group = await this.groupRepository.findOneOrFail({
      withDeleted: true,
      where: { id: groupId, client: { id: clientId } },
    });
    await this.groupFavouriteRepository.delete({ group: { id: group.id }, user: { id: userId } });
  }
}
