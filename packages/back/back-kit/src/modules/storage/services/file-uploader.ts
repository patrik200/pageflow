import { Injectable } from "@nestjs/common";
import { runOnTransactionRollback, Transactional } from "typeorm-transactional";
import fs from "node:fs/promises";

import { StorageFileEntity } from "entities/StorageFileEntity";

import { ServiceError } from "libs/serviceError";
import type { ExpressMultipartFile } from "types";

import type { CompareDocumentExtensionPreset } from "./extensions";
import { FileExtensionsService } from "./extensions";
import { StorageSaveService } from "./save";

@Injectable()
export class FileUploaderService {
  constructor(private fileExtensionsService: FileExtensionsService, private storageSaveService: StorageSaveService) {}

  @Transactional()
  async uploadFileOrFail(bucket: string, file: ExpressMultipartFile, extensionPreset?: CompareDocumentExtensionPreset) {
    const extension = this.fileExtensionsService.getExtensionOrFail(file.path);
    if (
      extensionPreset &&
      !this.fileExtensionsService.compareDocumentExtensionPresetAndExtension(extensionPreset, extension)
    )
      throw new ServiceError("file", "Не корректное расширение файла", 400);

    const fileBuffer = await fs.readFile(file.path);

    const savedFile = await this.storageSaveService
      .saveBuffer({ bucket, buffer: fileBuffer, ext: extension, fileName: file.name })
      .catch(ServiceError.throwFabric("file", "Не удалось сохранить файл"));

    runOnTransactionRollback(() => savedFile.discardSavingFileToPhysicalStorage());

    const result = {
      discardSavingFileToPhysicalStorage: savedFile.discardSavingFileToPhysicalStorage,
      id: savedFile.id,
      fileName: savedFile.fileName,
      bucket: savedFile.bucket,
      size: savedFile.size,
      buffer: fileBuffer,
    };
    Object.defineProperty(result, "buffer", { enumerable: false, writable: true, value: result.buffer });
    return result;
  }

  @Transactional()
  async deleteFileOrFail(file: StorageFileEntity) {
    await this.storageSaveService.delete(file.bucket, file.id);
  }
}
