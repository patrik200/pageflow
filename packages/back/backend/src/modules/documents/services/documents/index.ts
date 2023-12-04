import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { AttributeTypeEntity } from "entities/Attribute";
import { AttributeValueEntity } from "entities/Attribute/value";

import { DocumentDependenciesModule } from "./dependencies";
import { DocumentsElasticModule } from "./elastic";
import { DocumentsFavouritesModule } from "./favourites";
import { DocumentsPermissionsModule } from "./permissions";
import { ActiveDocumentService } from "./active";
import { ArchiveDocumentService } from "./archive";
import { CreateDocumentService } from "./create";
import { DeleteDocumentService } from "./delete";
import { EditDocumentService } from "./edit";
import { GetDocumentService } from "./get";
import { GetDocumentsListService } from "./get-list";
import { GetDocumentResponsibleUserService } from "./get-responsible-user";
import { MoveDocumentService } from "./move";
import { DocumentEventListenerService } from "./background/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentGroupEntity, AttributeTypeEntity, AttributeValueEntity]),
    DocumentDependenciesModule,
    DocumentsElasticModule,
    DocumentsFavouritesModule,
    DocumentsPermissionsModule,
  ],
  providers: [
    ActiveDocumentService,
    ArchiveDocumentService,
    CreateDocumentService,
    DeleteDocumentService,
    EditDocumentService,
    GetDocumentService,
    GetDocumentsListService,
    GetDocumentResponsibleUserService,
    MoveDocumentService,
    DocumentEventListenerService,
  ],
  exports: [
    ActiveDocumentService,
    ArchiveDocumentService,
    CreateDocumentService,
    DeleteDocumentService,
    EditDocumentService,
    GetDocumentService,
    GetDocumentsListService,
    GetDocumentResponsibleUserService,
    MoveDocumentService,
  ],
})
export class DocumentsModule {}
