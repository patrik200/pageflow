import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";

import { StorageController } from "./controllers";

import { DeleteFileService } from "./services/file/delete";
import { UploadFileService } from "./services/file/upload";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [StorageController],
  providers: [DeleteFileService, UploadFileService],
  exports: [DeleteFileService, UploadFileService],
})
export class StorageModule {}

export * from "./services/file/delete";
export * from "./services/file/upload";
