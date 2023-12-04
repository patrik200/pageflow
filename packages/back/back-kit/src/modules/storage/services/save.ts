import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import crypto from "crypto";
import { runOnTransactionRollback, Transactional } from "typeorm-transactional";
import { Ext } from "@app/shared-enums";

import { ServiceError } from "libs";

import { StorageFileEntity } from "entities/StorageFileEntity";

import { S3StorageService } from "../storage-implementations/s3";
import type { FileToSaveInterface, FileToSaveRawInterface } from "../types";

export type IncomeFile = ({ name: string; addUUIdToName?: boolean } | { ext: Ext }) & FileToSaveRawInterface;

@Injectable()
export class StorageSaveService {
  constructor(
    @InjectRepository(StorageFileEntity) private storageFileRepository: Repository<StorageFileEntity>,
    private storageService: S3StorageService,
  ) {}

  private async saveFileToDBStorage({ id, bucket, fileName, size }: FileToSaveInterface) {
    await this.storageFileRepository.save({ id, bucket, fileName: fileName ?? id, size });
  }

  private generateUniqFileID() {
    return (crypto.randomUUID() + "-" + Buffer.from(Date.now().toString()).toString("hex")) as string;
  }

  private getFileToSaveFromIncomeFile({ bucket, ...incomeFile }: IncomeFile, size: number) {
    if ("name" in incomeFile) {
      const name = incomeFile.addUUIdToName ? this.generateUniqFileID() + "_" + incomeFile.name : incomeFile.name;
      return { id: name, bucket, fileName: incomeFile.fileName, size } as FileToSaveInterface;
    }

    return {
      id: this.generateUniqFileID() + incomeFile.ext,
      bucket,
      fileName: incomeFile.fileName,
      size,
    } as FileToSaveInterface;
  }

  @Transactional()
  async saveBuffer(incomeFile: IncomeFile & { buffer: Buffer }) {
    const fileToSave = this.getFileToSaveFromIncomeFile(incomeFile, incomeFile.buffer.length);

    const discardSavingFileToPhysicalStorage = () => this.storageService.deleteFile(fileToSave.bucket, fileToSave.id);
    runOnTransactionRollback(discardSavingFileToPhysicalStorage);

    await this.storageService.saveFileBuffer({ ...fileToSave, buffer: incomeFile.buffer });
    await this.saveFileToDBStorage(fileToSave);

    return {
      bucket: fileToSave.bucket,
      id: fileToSave.id,
      fileName: fileToSave.fileName,
      size: fileToSave.size,
      discardSavingFileToPhysicalStorage,
    };
  }

  @Transactional()
  async saveStream(incomeFile: IncomeFile & { stream: NodeJS.ReadableStream }) {
    const fileToSave = this.getFileToSaveFromIncomeFile(incomeFile, 0);

    const discardSavingFileToPhysicalStorage = () => this.storageService.deleteFile(fileToSave.bucket, fileToSave.id);
    runOnTransactionRollback(discardSavingFileToPhysicalStorage);

    await this.storageService.saveFileStream({ ...fileToSave, stream: incomeFile.stream });
    const stats = await this.storageService.statFile(fileToSave.bucket, fileToSave.id);

    if (!stats) {
      this.storageService.deleteFile(fileToSave.bucket, fileToSave.id);
      throw new ServiceError("file", "Не удалось сохранить файл");
    }

    fileToSave.size = stats.size;

    await this.saveFileToDBStorage(fileToSave);

    return {
      bucket: fileToSave.bucket,
      id: fileToSave.id,
      fileName: fileToSave.fileName,
      size: fileToSave.size,
      discardSavingFileToPhysicalStorage,
    };
  }

  @Transactional()
  async delete(bucket: string, id: string) {
    const file = await this.storageFileRepository.findOneOrFail({
      where: { id, bucket },
      relations: ["childVariants"],
    });

    await this.storageFileRepository.save({ id, childVariants: [] });

    for (const variant of file.childVariants) {
      await this.delete(bucket, variant.id);
    }

    const success = await this.storageService.deleteFile(bucket, id);
    if (!success) return false;
    await this.storageFileRepository.delete({ id, bucket });
    return true;
  }

  @Transactional()
  async createBucketIfNotExists(bucket: string) {
    return await this.storageService.createBucketIfNotExists(bucket);
  }

  @Transactional()
  async deleteBucketIfExists(bucket: string) {
    return await this.storageService.deleteBucketIfExists(bucket);
  }

  @Transactional()
  async addVariant(bucket: string, id: string, variantId: string) {
    await this.storageFileRepository.save({ id: variantId, bucket, fileName: variantId, size: 0, parentFile: { id } });
  }
}
