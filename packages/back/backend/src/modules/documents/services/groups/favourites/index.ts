import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentGroupFavouriteEntity } from "entities/Document/Group/Favourite";

import { DocumentGroupFavouritesController } from "./controllers";
import { AddDocumentGroupFavouritesService } from "./add";
import { GetDocumentGroupIsFavouritesService } from "./get-is-favourite";
import { GetDocumentGroupFavouritesListService } from "./get-list";
import { RemoveDocumentGroupFavouritesService } from "./remove";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentGroupEntity, DocumentGroupFavouriteEntity])],
  controllers: [DocumentGroupFavouritesController],
  providers: [
    AddDocumentGroupFavouritesService,
    GetDocumentGroupIsFavouritesService,
    GetDocumentGroupFavouritesListService,
    RemoveDocumentGroupFavouritesService,
  ],
  exports: [
    AddDocumentGroupFavouritesService,
    GetDocumentGroupIsFavouritesService,
    GetDocumentGroupFavouritesListService,
    RemoveDocumentGroupFavouritesService,
  ],
})
export class DocumentGroupsFavouritesModule {}

export * from "./add";
export * from "./get-is-favourite";
export * from "./get-list";
export * from "./remove";
