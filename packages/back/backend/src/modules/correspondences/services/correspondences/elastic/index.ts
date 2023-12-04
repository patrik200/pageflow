import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { CreateCorrespondenceElasticService } from "./create";
import { DeleteCorrespondenceElasticService } from "./delete";
import { EditCorrespondenceElasticService } from "./edit";
import { GetCorrespondenceIdElasticService } from "./get-id";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CorrespondenceEntity])],
  providers: [
    CreateCorrespondenceElasticService,
    DeleteCorrespondenceElasticService,
    EditCorrespondenceElasticService,
    GetCorrespondenceIdElasticService,
  ],
  exports: [
    CreateCorrespondenceElasticService,
    DeleteCorrespondenceElasticService,
    EditCorrespondenceElasticService,
    GetCorrespondenceIdElasticService,
  ],
})
export class CorrespondencesElasticModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
export * from "./get-id";
