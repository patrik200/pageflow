import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";

import { DocumentsController } from "./controllers";

import { DocumentsModule } from "./services/documents";
import { DocumentGroupsModule } from "./services/groups";
import { DocumentRevisionsModule } from "./services/revisions";
import { GetDocumentsAndGroupsService } from "./services/get";
import { InitElasticDocumentGroupsAndDocumentsService } from "./services/init";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentGroupEntity, DocumentRootGroupEntity]),
    DocumentsModule,
    DocumentGroupsModule,
    DocumentRevisionsModule,
  ],
  controllers: [DocumentsController],
  providers: [GetDocumentsAndGroupsService, InitElasticDocumentGroupsAndDocumentsService],
  exports: [GetDocumentsAndGroupsService, InitElasticDocumentGroupsAndDocumentsService],
})
export class DocumentsAndGroupsModule {
  constructor(initElasticService: InitElasticDocumentGroupsAndDocumentsService) {
    initElasticService.appBootstrap();
    initElasticService.createUniversalIngestAttachmentProcessorPipeline();
  }
}

export * from "./dto/get/Document";
export * from "./dto/get/DocumentGroup";

export * from "./events/DocumentCreated";
export * from "./events/DocumentDeleted";
export * from "./events/DocumentResponsibleUserFlowUpdated";
export * from "./events/DocumentResponsibleUserUpdated";
export * from "./events/DocumentUpdated";

export * from "./services/documents/dependencies";
export * from "./services/documents/elastic";
export * from "./services/documents/favourites";
export * from "./services/documents/permissions";
export * from "./services/documents/active";
export * from "./services/documents/archive";
export * from "./services/documents/create";
export * from "./services/documents/delete";
export * from "./services/documents/edit";
export * from "./services/documents/get";
export * from "./services/documents/get-list";
export * from "./services/documents/get-responsible-user";
export * from "./services/documents/move";

export * from "./services/groups/elastic";
export * from "./services/groups/favourites";
export * from "./services/groups/permissions";
export * from "./services/groups/create";
export * from "./services/groups/create-root";
export * from "./services/groups/delete";
export * from "./services/groups/delete-root";
export * from "./services/groups/edit";
export * from "./services/groups/get";
export * from "./services/groups/get-list";
export * from "./services/groups/get-root";
export * from "./services/groups/move";

export * from "./services/revisions/active-automatically";
export * from "./services/revisions/archive-automatically";
export * from "./services/revisions/edit-status";

export * from "./services/get";

export * from "./services/init";

export * from "./types";
