import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentFavouriteEntity } from "entities/Document/Document/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class AddDocumentFavouritesService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentFavouriteEntity)
    private documentFavouriteRepository: Repository<DocumentFavouriteEntity>,
  ) {}

  @Transactional()
  async addDocumentFavouriteOrFail(documentId: string) {
    const { clientId, userId } = getCurrentUser();
    const document = await this.documentRepository.findOneOrFail({
      withDeleted: true,
      where: { id: documentId, client: { id: clientId } },
    });
    await this.documentFavouriteRepository.save({
      document: { id: document.id },
      user: { id: userId },
    });
  }
}
