import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";

import { DocumentGroupsElasticModule } from "./elastic";
import { DocumentGroupsFavouritesModule } from "./favourites";
import { DocumentsGroupPermissionsModule } from "./permissions";
import { CreateDocumentGroupService } from "./create";
import { CreateDocumentRootGroupService } from "./create-root";
import { DeleteDocumentGroupService } from "./delete";
import { DeleteDocumentRootGroupService } from "./delete-root";
import { EditDocumentGroupService } from "./edit";
import { GetDocumentGroupService } from "./get";
import { GetDocumentGroupsListService } from "./get-list";
import { GetDocumentRootGroupService } from "./get-root";
import { MoveDocumentGroupService } from "./move";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentGroupEntity, DocumentRootGroupEntity]),
    DocumentGroupsElasticModule,
    DocumentGroupsFavouritesModule,
    DocumentsGroupPermissionsModule,
  ],
  providers: [
    CreateDocumentGroupService,
    CreateDocumentRootGroupService,
    DeleteDocumentGroupService,
    DeleteDocumentRootGroupService,
    EditDocumentGroupService,
    GetDocumentGroupService,
    GetDocumentGroupsListService,
    GetDocumentRootGroupService,
    MoveDocumentGroupService,
  ],
  exports: [
    CreateDocumentGroupService,
    CreateDocumentRootGroupService,
    DeleteDocumentGroupService,
    DeleteDocumentRootGroupService,
    EditDocumentGroupService,
    GetDocumentGroupService,
    GetDocumentGroupsListService,
    GetDocumentRootGroupService,
    MoveDocumentGroupService,
  ],
})
export class DocumentGroupsModule {}
