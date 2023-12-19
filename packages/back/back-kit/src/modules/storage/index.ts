import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "@app/core-config";

import { StorageFileEntity } from "entities/StorageFileEntity";

import { CryptoModule } from "../crypto";
import { S3ControllerService } from "./storage-implementations/s3/internal/S3ControllerService";
import { S3StorageService } from "./storage-implementations/s3";
import { StorageControllerService } from "./service";

import { StorageSaveService } from "./services/save";
import { StorageGetService } from "./services/get";
import { FileExtensionsService } from "./services/extensions";
import { FileUploaderService } from "./services/file-uploader";
import { ImageVariantsService } from "./services/image-variants";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([StorageFileEntity]), CryptoModule],
  providers: [
    {
      provide: S3ControllerService,
      useFactory: () =>
        S3ControllerService.register({
          host: config.s3.host,
          port: config.s3.port,
          region: "eu-central-1",
          accessKey: config._secrets.s3.access,
          secretKey: config._secrets.s3.secret,
        }),
    },
    S3StorageService,
    StorageSaveService,
    StorageGetService,
    StorageControllerService,
    FileExtensionsService,
    FileUploaderService,
    ImageVariantsService,
  ],
  exports: [
    StorageSaveService,
    StorageGetService,
    StorageControllerService,
    FileExtensionsService,
    FileUploaderService,
    ImageVariantsService,
  ],
})
export class StorageModule {}

export * from "./dto/StorageFile";
export * from "./service";
