import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceGroupFavouriteEntity } from "entities/Correspondence/Group/Favourite";

import { CorrespondenceGroupFavouritesController } from "./controller";
import { AddCorrespondenceGroupFavouritesService } from "./add";
import { GetCorrespondenceGroupIsFavouritesService } from "./get-is-favourite";
import { GetCorrespondenceGroupFavouritesListService } from "./get-list";
import { RemoveCorrespondenceGroupFavouritesService } from "./remove";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CorrespondenceGroupEntity, CorrespondenceGroupFavouriteEntity])],
  controllers: [CorrespondenceGroupFavouritesController],
  providers: [
    AddCorrespondenceGroupFavouritesService,
    GetCorrespondenceGroupIsFavouritesService,
    GetCorrespondenceGroupFavouritesListService,
    RemoveCorrespondenceGroupFavouritesService,
  ],
  exports: [
    AddCorrespondenceGroupFavouritesService,
    GetCorrespondenceGroupIsFavouritesService,
    GetCorrespondenceGroupFavouritesListService,
    RemoveCorrespondenceGroupFavouritesService,
  ],
})
export class CorrespondencesGroupFavouritesModule {}

export * from "./add";
export * from "./get-is-favourite";
export * from "./get-list";
export * from "./remove";
