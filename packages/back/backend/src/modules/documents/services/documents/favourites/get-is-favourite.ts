import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentFavouriteEntity } from "entities/Document/Document/Favourite";
import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetDocumentIsFavouritesService {
  constructor(
    @InjectRepository(DocumentFavouriteEntity)
    private documentFavouriteRepository: Repository<DocumentFavouriteEntity>,
  ) {}

  async getDocumentIsFavourite(documentId: string) {
    const favourite = await this.documentFavouriteRepository.findOne({
      where: { document: { id: documentId }, user: { id: getCurrentUser().userId } },
    });

    return !!favourite;
  }

  async loadDocumentIsFavourite(document: DocumentEntity) {
    document.favourite = await this.getDocumentIsFavourite(document.id);
    return document;
  }
}
