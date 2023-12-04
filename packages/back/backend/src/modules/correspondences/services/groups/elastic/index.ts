import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { CreateCorrespondenceGroupElasticService } from "./create";
import { DeleteCorrespondenceGroupElasticService } from "./delete";
import { EditCorrespondenceGroupElasticService } from "./edit";
import { GetCorrespondenceGroupIdElasticService } from "./get-id";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CorrespondenceGroupEntity])],
  providers: [
    CreateCorrespondenceGroupElasticService,
    DeleteCorrespondenceGroupElasticService,
    EditCorrespondenceGroupElasticService,
    GetCorrespondenceGroupIdElasticService,
  ],
  exports: [
    CreateCorrespondenceGroupElasticService,
    DeleteCorrespondenceGroupElasticService,
    EditCorrespondenceGroupElasticService,
    GetCorrespondenceGroupIdElasticService,
  ],
})
export class CorrespondencesGroupsElasticModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
export * from "./get-id";
