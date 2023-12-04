import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { AttributeTypeEntity } from "entities/Attribute";
import { AttributeValueEntity } from "entities/Attribute/value";

import { CorrespondencesDependenciesModule } from "./dependencies";
import { CorrespondencesElasticModule } from "./elastic";
import { CorrespondencesFavouritesModule } from "./favourites";
import { CorrespondencesPermissionsModule } from "./permissions";
import { ActiveCorrespondencesService } from "./active";
import { ArchiveCorrespondencesService } from "./archive";
import { CreateCorrespondencesService } from "./create";
import { DeleteCorrespondenceService } from "./delete";
import { EditCorrespondencesService } from "./edit";
import { GetCorrespondenceService } from "./get";
import { GetCorrespondencesListService } from "./get-list";
import { MoveCorrespondenceService } from "./move";
import { CorrespondenceEventListenerService } from "./background/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorrespondenceEntity,
      CorrespondenceGroupEntity,
      AttributeTypeEntity,
      AttributeValueEntity,
    ]),
    CorrespondencesDependenciesModule,
    CorrespondencesElasticModule,
    CorrespondencesFavouritesModule,
    CorrespondencesPermissionsModule,
  ],
  providers: [
    ActiveCorrespondencesService,
    ArchiveCorrespondencesService,
    CreateCorrespondencesService,
    DeleteCorrespondenceService,
    EditCorrespondencesService,
    GetCorrespondenceService,
    GetCorrespondencesListService,
    MoveCorrespondenceService,
    CorrespondenceEventListenerService,
  ],
  exports: [
    ActiveCorrespondencesService,
    ArchiveCorrespondencesService,
    CreateCorrespondencesService,
    DeleteCorrespondenceService,
    EditCorrespondencesService,
    GetCorrespondenceService,
    GetCorrespondencesListService,
    MoveCorrespondenceService,
  ],
})
export class CorrespondencesModule {}
