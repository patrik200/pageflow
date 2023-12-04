import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";

import { CorrespondencesController } from "./controllers";

import { CorrespondencesModule } from "./services/correspondences";
import { CorrespondenceGroupsModule } from "./services/groups";
import { GetCorrespondenceAndGroupService } from "./services/get";
import { InitElasticCorrespondenceAndGroupService } from "./services/init";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CorrespondenceEntity, CorrespondenceGroupEntity, CorrespondenceRootGroupEntity]),
    CorrespondencesModule,
    CorrespondenceGroupsModule,
  ],
  controllers: [CorrespondencesController],
  providers: [GetCorrespondenceAndGroupService, InitElasticCorrespondenceAndGroupService],
  exports: [GetCorrespondenceAndGroupService, InitElasticCorrespondenceAndGroupService],
})
export class CorrespondencesAndGroupsModule {
  constructor(initElasticService: InitElasticCorrespondenceAndGroupService) {
    initElasticService.appBootstrap();
  }
}

export * from "./dto/get/Correspondence";
export * from "./dto/get/CorrespondenceGroup";

export * from "./events/CorrespondenceCreated";
export * from "./events/CorrespondenceDeleted";
export * from "./events/CorrespondenceUpdated";

export * from "./services/correspondences/dependencies";
export * from "./services/correspondences/elastic";
export * from "./services/correspondences/favourites";
export * from "./services/correspondences/permissions";
export * from "./services/correspondences/active";
export * from "./services/correspondences/archive";
export * from "./services/correspondences/create";
export * from "./services/correspondences/delete";
export * from "./services/correspondences/edit";
export * from "./services/correspondences/get";
export * from "./services/correspondences/get-list";
export * from "./services/correspondences/move";

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
export * from "./services/groups/move-root";

export * from "./services/get";

export * from "./services/init";

export * from "./types";
