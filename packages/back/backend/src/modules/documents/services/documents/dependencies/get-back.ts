import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";

import { GetDocumentIsFavouritesService } from "../favourites";

@Injectable()
export class GetDocumentBackDependenciesService {
  constructor(
    @Inject(forwardRef(() => GetDocumentIsFavouritesService))
    private getDocumentIsFavouritesService: GetDocumentIsFavouritesService,
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
  ) {}

  async getDocumentsDependentOnCorrespondence(correspondenceId: string) {
    const currentUser = getCurrentUser();

    const documents = await this.documentRepository
      .createQueryBuilder("doc")
      .innerJoinAndSelect("doc.client", "client")
      .innerJoinAndSelect("doc.author", "author")
      .leftJoin("doc.dependsOnCorrespondences", "correspondence")
      .where("correspondence.id = :correspondenceId", { correspondenceId })
      .getMany();

    return await Promise.all(
      documents.map(async (doc: DocumentEntity & { favourite?: boolean }) => {
        doc.calculateAllCans(currentUser);
        doc.favourite = await this.getDocumentIsFavouritesService.getDocumentIsFavourite(doc.id);
        return doc;
      }),
    );
  }
}
