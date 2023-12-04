import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionFavouriteEntity } from "entities/Document/Document/Revision/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDocumentRevisionIsFavouritesService {
  constructor(
    @InjectRepository(DocumentRevisionFavouriteEntity)
    private favouriteRepository: Repository<DocumentRevisionFavouriteEntity>,
  ) {}

  async getRevisionIsFavourite(revisionId: string) {
    const favourite = await this.favouriteRepository.findOne({
      where: { revision: { id: revisionId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }
}
