import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";

import { DocumentDependenciesController } from "./controllers";
import { CreateDocumentDependencyService } from "./create";
import { DeleteDocumentDependencyService } from "./delete";
import { GetDocumentDependenciesService } from "./get";
import { GetDocumentBackDependenciesService } from "./get-back";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  controllers: [DocumentDependenciesController],
  providers: [
    CreateDocumentDependencyService,
    DeleteDocumentDependencyService,
    GetDocumentDependenciesService,
    GetDocumentBackDependenciesService,
  ],
  exports: [
    CreateDocumentDependencyService,
    DeleteDocumentDependencyService,
    GetDocumentDependenciesService,
    GetDocumentBackDependenciesService,
  ],
})
export class DocumentDependenciesModule {}

export * from "./create";
export * from "./delete";
export * from "./get";
export * from "./get-back";
