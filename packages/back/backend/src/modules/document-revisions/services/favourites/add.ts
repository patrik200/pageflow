import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionFavouriteEntity } from "entities/Document/Document/Revision/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddDocumentRevisionFavouritesService {
  constructor(
    @InjectRepository(DocumentRevisionEntity)
    private revisionRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionFavouriteEntity)
    private favouriteRepository: Repository<DocumentRevisionFavouriteEntity>,
  ) {}

  @Transactional()
  async addFavouriteOrFail(revisionId: string) {
    const { clientId, userId } = getCurrentUser();
    const revision = await this.revisionRepository.findOneOrFail({
      withDeleted: true,
      where: { id: revisionId, document: { client: { id: clientId } } },
      relations: { document: true },
    });
    await this.favouriteRepository.save({ revision: { id: revision.id }, user: { id: userId } });
  }
}
