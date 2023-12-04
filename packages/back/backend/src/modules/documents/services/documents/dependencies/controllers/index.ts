import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";
import { ResponseCorrespondencesListDTO } from "modules/correspondences";

import { CreateDocumentDependencyService } from "../create";
import { DeleteDocumentDependencyService } from "../delete";
import { GetDocumentDependenciesService } from "../get";
import { GetDocumentBackDependenciesService } from "../get-back";
import { ResponseDocumentsListDTO } from "../../../../dto/get/Document";

@Controller("documents")
export class DocumentDependenciesController {
  constructor(
    private createDocumentDependencyService: CreateDocumentDependencyService,
    private getDocumentDependenciesService: GetDocumentDependenciesService,
    private deleteDocumentDependenciesService: DeleteDocumentDependencyService,
    private getDocumentBackDependenciesService: GetDocumentBackDependenciesService,
  ) {}

  @Get(":documentId/dependsOn")
  @withUserAuthorized([UserRole.USER])
  async getDocumentDependencies(@Param("documentId") documentId: string) {
    const correspondences = await this.getDocumentDependenciesService.getDocumentDependencies(documentId);

    return new ControllerResponse(ResponseCorrespondencesListDTO, { list: correspondences });
  }

  @Get("dependentOn/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async getDocumentBackDependencies(@Param("correspondenceId") correspondenceId: string) {
    const documents = await this.getDocumentBackDependenciesService.getDocumentsDependentOnCorrespondence(
      correspondenceId,
    );

    return new ControllerResponse(ResponseDocumentsListDTO, { list: documents });
  }

  @Post(":documentId/dependsOn/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async dependDocumentOnCorrespondence(
    @Param("documentId") documentId: string,
    @Param("correspondenceId") correspondenceId: string,
  ) {
    await this.createDocumentDependencyService.dependDocumentOnCorrespondence(documentId, correspondenceId);
  }

  @Delete(":documentId/dependsOn/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async removeDocumentDependencies(
    @Param("documentId") documentId: string,
    @Param("correspondenceId") correspondenceId: string,
  ) {
    await this.deleteDocumentDependenciesService.undependFromCorrespondence(documentId, correspondenceId);
  }
}
