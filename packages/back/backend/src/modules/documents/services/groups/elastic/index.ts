import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { CreateDocumentGroupsElasticService } from "./create";
import { DeleteDocumentGroupsElasticService } from "./delete";
import { EditDocumentGroupsElasticService } from "./edit";
import { GetDocumentGroupElasticService } from "./get-id";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentGroupEntity])],
  providers: [
    CreateDocumentGroupsElasticService,
    DeleteDocumentGroupsElasticService,
    EditDocumentGroupsElasticService,
    GetDocumentGroupElasticService,
  ],
  exports: [
    CreateDocumentGroupsElasticService,
    DeleteDocumentGroupsElasticService,
    EditDocumentGroupsElasticService,
    GetDocumentGroupElasticService,
  ],
})
export class DocumentGroupsElasticModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
export * from "./get-id";
