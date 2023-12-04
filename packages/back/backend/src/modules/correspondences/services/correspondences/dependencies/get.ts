import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { getCurrentUser } from "modules/auth";
import { GetDocumentIsFavouritesService } from "modules/documents";

import { GetCorrespondenceService } from "../get";

@Injectable()
export class GetCorrespondenceDependenciesService {
  constructor(
    @Inject(forwardRef(() => GetDocumentIsFavouritesService))
    private getDocumentIsFavouritesService: GetDocumentIsFavouritesService,
    private getCorrespondenceService: GetCorrespondenceService,
  ) {}

  async getCorrespondenceDependencies(correspondenceId: string) {
    const currentUser = getCurrentUser();

    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadDependsOnDocument: true,
      loadDependsOnDocumentAuthor: true,
    });

    return await Promise.all(
      correspondence.dependsOnDocuments.map(async (document) => {
        document.calculateAllCans(currentUser);
        document.favourite = await this.getDocumentIsFavouritesService.getDocumentIsFavourite(document.id);
        return document;
      }),
    );
  }
}
