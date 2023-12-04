import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";
import { CorrespondenceRevisionCommentEntity } from "entities/Correspondence/Correspondence/Revision/Comment";
import { CorrespondenceRevisionFileEntity } from "entities/Correspondence/Correspondence/Revision/File";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceRevisionFavouriteEntity } from "entities/Correspondence/Correspondence/Revision/Favourite";

import { CorrespondenceRevisionsController } from "./controllers";
import { CorrespondenceRevisionFavouritesController } from "./controllers/favourites";

import { AddCorrespondenceRevisionFavouritesService } from "./services/favourites/add";
import { GetCorrespondenceRevisionIsFavouritesService } from "./services/favourites/get-is-favourite";
import { GetCorrespondenceRevisionFavouritesListService } from "./services/favourites/get-list";
import { RemoveCorrespondenceRevisionFavouritesService } from "./services/favourites/remove";
import { CreateCorrespondenceRevisionFilesElasticService } from "./services/files/create-elastic";
import { DeleteCorrespondenceRevisionFilesService } from "./services/files/delete";
import { UploadCorrespondenceRevisionFilesService } from "./services/files/upload";
import { InitElasticCorrespondenceRevisionService } from "./services/init";
import { ActiveCorrespondenceRevisionsService } from "./services/statuses/active";
import { ArchiveCorrespondenceRevisionsService } from "./services/statuses/archive";
import { CreateCorrespondenceRevisionsService } from "./services/revisions/create";
import { CreateCorrespondenceRevisionsElasticService } from "./services/revisions/create-elastic";
import { DeleteCorrespondenceRevisionsService } from "./services/revisions/delete";
import { EditCorrespondenceRevisionsService } from "./services/revisions/edit";
import { GetCorrespondenceRevisionService } from "./services/revisions/get";
import { GetCorrespondenceRevisionsListService } from "./services/revisions/get-list";
import { MoveCorrespondenceRevisionService } from "./services/revisions/move";
import { CorrespondenceRevisionEventListenerService } from "./services/background/event-listener";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorrespondenceRevisionEntity,
      CorrespondenceRevisionFileEntity,
      CorrespondenceRevisionCommentEntity,
      CorrespondenceEntity,
      CorrespondenceGroupEntity,
      CorrespondenceRevisionFavouriteEntity,
    ]),
  ],
  controllers: [CorrespondenceRevisionFavouritesController, CorrespondenceRevisionsController],
  providers: [
    AddCorrespondenceRevisionFavouritesService,
    GetCorrespondenceRevisionIsFavouritesService,
    GetCorrespondenceRevisionFavouritesListService,
    RemoveCorrespondenceRevisionFavouritesService,
    CreateCorrespondenceRevisionFilesElasticService,
    DeleteCorrespondenceRevisionFilesService,
    UploadCorrespondenceRevisionFilesService,
    ActiveCorrespondenceRevisionsService,
    ArchiveCorrespondenceRevisionsService,
    CreateCorrespondenceRevisionsService,
    CreateCorrespondenceRevisionsElasticService,
    DeleteCorrespondenceRevisionsService,
    EditCorrespondenceRevisionsService,
    GetCorrespondenceRevisionService,
    GetCorrespondenceRevisionsListService,
    MoveCorrespondenceRevisionService,
    InitElasticCorrespondenceRevisionService,
    CorrespondenceRevisionEventListenerService,
  ],
  exports: [
    AddCorrespondenceRevisionFavouritesService,
    GetCorrespondenceRevisionIsFavouritesService,
    GetCorrespondenceRevisionFavouritesListService,
    RemoveCorrespondenceRevisionFavouritesService,
    CreateCorrespondenceRevisionFilesElasticService,
    DeleteCorrespondenceRevisionFilesService,
    UploadCorrespondenceRevisionFilesService,
    ActiveCorrespondenceRevisionsService,
    ArchiveCorrespondenceRevisionsService,
    CreateCorrespondenceRevisionsService,
    CreateCorrespondenceRevisionsElasticService,
    DeleteCorrespondenceRevisionsService,
    EditCorrespondenceRevisionsService,
    GetCorrespondenceRevisionService,
    GetCorrespondenceRevisionsListService,
    MoveCorrespondenceRevisionService,
    InitElasticCorrespondenceRevisionService,
  ],
})
export class CorrespondenceRevisionsModule {
  constructor(initElasticCorrespondenceRevisionService: InitElasticCorrespondenceRevisionService) {
    initElasticCorrespondenceRevisionService.appBootstrap();
  }
}

export * from "./services/favourites/add";
export * from "./services/favourites/get-is-favourite";
export * from "./services/favourites/get-list";
export * from "./services/favourites/remove";
export * from "./services/files/create-elastic";
export * from "./services/files/delete";
export * from "./services/files/upload";
export * from "./services/revisions/create";
export * from "./services/revisions/create-elastic";
export * from "./services/revisions/delete";
export * from "./services/revisions/edit";
export * from "./services/revisions/get";
export * from "./services/revisions/get-list";
export * from "./services/revisions/move";
export * from "./services/statuses/active";
export * from "./services/statuses/archive";
export * from "./services/init";
