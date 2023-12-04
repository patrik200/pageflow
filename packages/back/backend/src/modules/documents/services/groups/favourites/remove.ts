import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    private groupFavouriteRepository: Repository<DocumentGroupFavouriteEntity>,
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
