import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { CorrespondenceDependenciesController } from "./controllers";
import { CreateCorrespondenceDependencyService } from "./create";
import { DeleteCorrespondenceDependencyService } from "./delete";
import { GetCorrespondenceDependenciesService } from "./get";
import { GetCorrespondenceBackDependenciesService } from "./get-back";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CorrespondenceEntity])],
  controllers: [CorrespondenceDependenciesController],
  providers: [
    CreateCorrespondenceDependencyService,
    DeleteCorrespondenceDependencyService,
    GetCorrespondenceDependenciesService,
    GetCorrespondenceBackDependenciesService,
  ],
  exports: [
    CreateCorrespondenceDependencyService,
    DeleteCorrespondenceDependencyService,
    GetCorrespondenceDependenciesService,
    GetCorrespondenceBackDependenciesService,
  ],
})
export class CorrespondencesDependenciesModule {}

export * from "./create";
export * from "./delete";
export * from "./get";
export * from "./get-back";
