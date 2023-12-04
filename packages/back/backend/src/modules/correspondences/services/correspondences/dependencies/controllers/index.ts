import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { ResponseDocumentsListDTO } from "modules/documents/dto/get/Document";

import { CreateCorrespondenceDependencyService } from "../create";
import { DeleteCorrespondenceDependencyService } from "../delete";
import { GetCorrespondenceDependenciesService } from "../get";
import { GetCorrespondenceBackDependenciesService } from "../get-back";
import { ResponseCorrespondencesListDTO } from "../../../../dto/get/Correspondence";

@Controller("correspondences")
export class CorrespondenceDependenciesController {
  constructor(
    private getCorrespondenceDependenciesService: GetCorrespondenceDependenciesService,
    private createCorrespondenceDependencyService: CreateCorrespondenceDependencyService,
    private deleteCorrespondenceDependencyService: DeleteCorrespondenceDependencyService,
    private getCorrespondenceBackDependenciesService: GetCorrespondenceBackDependenciesService,
  ) {}

  @Get(":correspondenceId/dependsOn")
  @withUserAuthorized([UserRole.USER])
  async getCorrespondenceDependencies(@Param("correspondenceId") correspondenceId: string) {
    const documents = await this.getCorrespondenceDependenciesService.getCorrespondenceDependencies(correspondenceId);

    return new ControllerResponse(ResponseDocumentsListDTO, { list: documents });
  }

  @Get("dependentOn/:documentId")
  @withUserAuthorized([UserRole.USER])
  async getCorrespondencesDependentOnDocument(@Param("documentId") documentId: string): Promise<ControllerResponse> {
    const correspondences = await this.getCorrespondenceBackDependenciesService.getCorrespondencesDependentOnDocument(
      documentId,
    );

    return new ControllerResponse(ResponseCorrespondencesListDTO, { list: correspondences });
  }

  @Post(":correspondenceId/dependsOn/:documentId")
  @withUserAuthorized([UserRole.USER])
  async dependCorrespondenceOnDocument(
    @Param("correspondenceId") correspondenceId: string,
    @Param("documentId") documentId: string,
  ) {
    await this.createCorrespondenceDependencyService.dependCorrespondenceOnDocument(correspondenceId, documentId);
  }

  @Delete(":correspondenceId/dependsOn/:documentId")
  @withUserAuthorized([UserRole.USER])
  async removeCorrespondenceDependencies(
    @Param("correspondenceId") correspondenceId: string,
    @Param("documentId") documentId: string,
  ) {
    await this.deleteCorrespondenceDependencyService.deleteDependencyFromCorrespondence(documentId, correspondenceId);
  }
}
