import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentGroupFavouriteEntity } from "entities/Document/Group/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveDocumentGroupFavouritesService {
  constructor(
    @InjectRepository(DocumentGroupEntity)
    private groupRepository: Repository<DocumentGroupEntity>,
    @InjectRepository(DocumentGroupFavouriteEntity)
    private favouriteRepository: Repository<DocumentGroupFavouriteEntity>,
  ) {}

  @Transactional()
  async removeGroupFavouriteOrFail(groupId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const groupFindOptions: FindOptionsWhere<DocumentGroupEntity> = { id: groupId };
    const favouriteFindOptions: FindOptionsWhere<DocumentGroupFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    groupFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const group = await this.groupRepository.findOneOrFail({
      where: groupFindOptions,
    });

    favouriteFindOptions.group = { id: group.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
