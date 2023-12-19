import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentFavouriteEntity } from "entities/Document/Document/Favourite";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class RemoveDocumentFavouritesService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentFavouriteEntity)
    private favouriteRepository: Repository<DocumentFavouriteEntity>,
  ) {}

  @Transactional()
  async removeDocumentFavouriteOrFail(documentId: string, { forAllUsers }: { forAllUsers: boolean }) {
    const documentFindOptions: FindOptionsWhere<DocumentEntity> = { id: documentId };
    const favouriteFindOptions: FindOptionsWhere<DocumentFavouriteEntity> = {};

    const currentUser = getCurrentUser();
    documentFindOptions.client = { id: currentUser.clientId };

    if (!forAllUsers) {
      favouriteFindOptions.user = { id: currentUser.userId };
    }

    const document = await this.documentRepository.findOneOrFail({
      where: documentFindOptions,
    });

    favouriteFindOptions.document = { id: document.id };

    await this.favouriteRepository.delete(favouriteFindOptions);
  }
}
