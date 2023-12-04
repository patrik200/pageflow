import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";

import { CreateDocumentsElasticService } from "./create";
import { DeleteDocumentsElasticService } from "./delete";
import { EditDocumentsElasticService } from "./edit";
import { GetDocumentIdElasticService } from "./get-id";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  providers: [
    CreateDocumentsElasticService,
    DeleteDocumentsElasticService,
    EditDocumentsElasticService,
    GetDocumentIdElasticService,
  ],
  exports: [
    CreateDocumentsElasticService,
    DeleteDocumentsElasticService,
    EditDocumentsElasticService,
    GetDocumentIdElasticService,
  ],
})
export class DocumentsElasticModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
export * from "./get-id";
