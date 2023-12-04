import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { getCurrentUser } from "modules/auth";

import { GetCorrespondenceIsFavouritesService } from "../favourites";

@Injectable()
export class GetCorrespondenceBackDependenciesService {
  constructor(
    private getCorrespondenceIsFavouritesService: GetCorrespondenceIsFavouritesService,
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
  ) {}

  async getCorrespondencesDependentOnDocument(documentId: string) {
    const currentUser = getCurrentUser();

    const correspondences = await this.correspondenceRepository
      .createQueryBuilder("corr")
      .innerJoinAndSelect("corr.client", "client")
      .innerJoinAndSelect("corr.author", "author")
      .leftJoin("corr.dependsOnDocuments", "document")
      .where("document.id = :documentId", { documentId })
      .getMany();

    return await Promise.all(
      correspondences.map(async (correspondence) => {
        correspondence.calculateAllCans(currentUser);
        correspondence.favourite = await this.getCorrespondenceIsFavouritesService.getCorrespondenceIsFavourite(
          correspondence.id,
        );
        return correspondence;
      }),
    );
  }
}
