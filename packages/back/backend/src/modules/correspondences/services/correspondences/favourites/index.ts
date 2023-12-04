import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceFavouriteEntity } from "entities/Correspondence/Correspondence/Favourite";

import { CorrespondenceFavouritesController } from "./controller";
import { AddCorrespondenceFavouritesService } from "./add";
import { GetCorrespondenceIsFavouritesService } from "./get-is-favourite";
import { GetCorrespondenceFavouritesListService } from "./get-list";
import { RemoveCorrespondenceFavouritesService } from "./remove";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CorrespondenceEntity, CorrespondenceFavouriteEntity])],
  controllers: [CorrespondenceFavouritesController],
  providers: [
    AddCorrespondenceFavouritesService,
    GetCorrespondenceIsFavouritesService,
    GetCorrespondenceFavouritesListService,
    RemoveCorrespondenceFavouritesService,
  ],
  exports: [
    AddCorrespondenceFavouritesService,
    GetCorrespondenceIsFavouritesService,
    GetCorrespondenceFavouritesListService,
    RemoveCorrespondenceFavouritesService,
  ],
})
export class CorrespondencesFavouritesModule {}

export * from "./add";
export * from "./get-is-favourite";
export * from "./get-list";
export * from "./remove";
