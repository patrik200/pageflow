import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceFavouriteEntity } from "entities/Correspondence/Correspondence/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddCorrespondenceFavouritesService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(CorrespondenceFavouriteEntity)
    private correspondenceFavouriteRepository: Repository<CorrespondenceFavouriteEntity>,
  ) {}

  @Transactional()
  async addCorrespondenceFavouriteOrFail(correspondenceId: string) {
    const { clientId, userId } = getCurrentUser();
    const correspondence = await this.correspondenceRepository.findOneOrFail({
      withDeleted: true,
      where: { id: correspondenceId, client: { id: clientId } },
    });
    await this.correspondenceFavouriteRepository.save({
      correspondence: { id: correspondence.id },
      user: { id: userId },
    });
  }
}
