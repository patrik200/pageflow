import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentFavouriteEntity } from "entities/Document/Document/Favourite";

import { DocumentFavouritesController } from "./controllers";
import { AddDocumentFavouritesService } from "./add";
import { GetDocumentIsFavouritesService } from "./get-is-favourite";
import { GetDocumentFavouritesListService } from "./get-list";
import { RemoveDocumentFavouritesService } from "./remove";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentFavouriteEntity])],
  controllers: [DocumentFavouritesController],
  providers: [
    AddDocumentFavouritesService,
    GetDocumentIsFavouritesService,
    GetDocumentFavouritesListService,
    RemoveDocumentFavouritesService,
  ],
  exports: [
    AddDocumentFavouritesService,
    GetDocumentIsFavouritesService,
    GetDocumentFavouritesListService,
    RemoveDocumentFavouritesService,
  ],
})
export class DocumentsFavouritesModule {}

export * from "./add";
export * from "./get-is-favourite";
export * from "./get-list";
export * from "./remove";
