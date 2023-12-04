import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";

import { CorrespondencesGroupsElasticModule } from "./elastic";
import { CorrespondencesGroupFavouritesModule } from "./favourites";
import { CorrespondencesGroupPermissionsModule } from "./permissions";
import { CreateCorrespondenceGroupService } from "./create";
import { CreateCorrespondenceRootGroupService } from "./create-root";
import { DeleteCorrespondenceGroupService } from "./delete";
import { DeleteCorrespondenceRootGroupService } from "./delete-root";
import { EditCorrespondenceGroupService } from "./edit";
import { GetCorrespondenceGroupService } from "./get";
import { GetCorrespondenceGroupsListService } from "./get-list";
import { GetCorrespondenceRootGroupService } from "./get-root";
import { MoveCorrespondenceGroupService } from "./move";
import { MoveCorrespondenceRootGroupService } from "./move-root";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CorrespondenceEntity, CorrespondenceGroupEntity, CorrespondenceRootGroupEntity]),
    CorrespondencesGroupsElasticModule,
    CorrespondencesGroupFavouritesModule,
    CorrespondencesGroupPermissionsModule,
  ],
  providers: [
    CreateCorrespondenceGroupService,
    CreateCorrespondenceRootGroupService,
    DeleteCorrespondenceGroupService,
    DeleteCorrespondenceRootGroupService,
    EditCorrespondenceGroupService,
    GetCorrespondenceGroupService,
    GetCorrespondenceGroupsListService,
    GetCorrespondenceRootGroupService,
    MoveCorrespondenceGroupService,
    MoveCorrespondenceRootGroupService,
  ],
  exports: [
    CreateCorrespondenceGroupService,
    CreateCorrespondenceRootGroupService,
    DeleteCorrespondenceGroupService,
    DeleteCorrespondenceRootGroupService,
    EditCorrespondenceGroupService,
    GetCorrespondenceGroupService,
    GetCorrespondenceGroupsListService,
    GetCorrespondenceRootGroupService,
    MoveCorrespondenceGroupService,
    MoveCorrespondenceRootGroupService,
  ],
})
export class CorrespondenceGroupsModule {}
