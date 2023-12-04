import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DictionaryEntity, DictionaryValueEntity } from "entities/Dictionary/Dictionary";

import { DictionaryController } from "./controllers";

import { CreateDictionaryValueService } from "./services/dictionary-value/create";
import { DeleteDictionaryValueService } from "./services/dictionary-value/delete";
import { EditDictionaryValueService } from "./services/dictionary-value/edit";
import { EditSortDictionaryValueService } from "./services/dictionary-value/edit-sort";
import { GetDictionaryValueService } from "./services/dictionary-value/get";
import { GetDictionaryValuesListService } from "./services/dictionary-value/get-list";
import { CreateDictionaryService } from "./services/dictionary/create";
import { GetDictionaryService } from "./services/dictionary/get";
import { GetDictionaryListService } from "./services/dictionary/get-list";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEntity, DictionaryValueEntity])],
  controllers: [DictionaryController],
  providers: [
    CreateDictionaryService,
    GetDictionaryService,
    GetDictionaryListService,
    CreateDictionaryValueService,
    DeleteDictionaryValueService,
    EditDictionaryValueService,
    EditSortDictionaryValueService,
    GetDictionaryValueService,
    GetDictionaryValuesListService,
  ],
  exports: [
    CreateDictionaryService,
    GetDictionaryService,
    GetDictionaryListService,
    CreateDictionaryValueService,
    DeleteDictionaryValueService,
    EditDictionaryValueService,
    EditSortDictionaryValueService,
    GetDictionaryValueService,
    GetDictionaryValuesListService,
  ],
})
export class DictionaryModule {}

export * from "./events/DictionaryValueDeleted";
export * from "./services/dictionary/create";
export * from "./services/dictionary/get";
export * from "./services/dictionary/get-list";
export * from "./services/dictionary-value/create";
export * from "./services/dictionary-value/delete";
export * from "./services/dictionary-value/edit";
export * from "./services/dictionary-value/edit-sort";
export * from "./services/dictionary-value/get";
export * from "./services/dictionary-value/get-list";
