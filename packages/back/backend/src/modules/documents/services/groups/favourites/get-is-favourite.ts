import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentGroupFavouriteEntity } from "entities/Document/Group/Favourite";
import { DocumentGroupEntity } from "entities/Document/Group/group";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDocumentGroupIsFavouritesService {
  constructor(
    @InjectRepository(DocumentGroupFavouriteEntity)
    private groupFavouriteRepository: Repository<DocumentGroupFavouriteEntity>,
  ) {}

  async getGroupIsFavourite(groupId: string) {
    const favourite = await this.groupFavouriteRepository.findOne({
      where: { group: { id: groupId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadGroupIsFavourite(group: DocumentGroupEntity) {
    group.favourite = await this.getGroupIsFavourite(group.id);
    return group;
  }
}
