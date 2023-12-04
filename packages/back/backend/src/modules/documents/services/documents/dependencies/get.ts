import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { getCurrentUser } from "modules/auth";
import { GetCorrespondenceIsFavouritesService } from "modules/correspondences";

import { GetDocumentService } from "../get";

@Injectable()
export class GetDocumentDependenciesService {
  constructor(
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => GetCorrespondenceIsFavouritesService))
    private getCorrespondenceIsFavouritesService: GetCorrespondenceIsFavouritesService,
  ) {}

  async getDocumentDependencies(documentId: string) {
    const currentUser = getCurrentUser();

    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadDependsOnCorrespondences: true,
      loadDependsOnCorrespondencesAuthor: true,
    });

    return await Promise.all(
      document.dependsOnCorrespondences.map(async (correspondence) => {
        correspondence.calculateAllCans(currentUser);
        await this.getCorrespondenceIsFavouritesService.loadCorrespondenceIsFavourite(correspondence);
        return correspondence;
      }),
    );
  }
}
