import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { streamToBuffer } from "@jorgeferrero/stream-to-buffer";
import { Readable } from "node:stream";
import mime from "mime";
import { Ext } from "@app/shared-enums";

import { ServiceError } from "libs";

import { StorageFileEntity } from "entities/StorageFileEntity";

import { S3StorageService } from "../storage-implementations/s3";

type GetStorageFileEntityOptions = { bucket: string; id: string; onlyPublic?: boolean };

@Injectable()
export class StorageGetService {
  static getExtensionOrFail(filePath: string) {
    const fileExtension = mime.extension(mime.lookup(filePath));
    if (!fileExtension) throw new ServiceError("file", "bad extension", 400);
    return ("." + fileExtension) as Ext;
  }

  constructor(
    @InjectRepository(StorageFileEntity) private storageFileRepository: Repository<StorageFileEntity>,
    private storageService: S3StorageService,
  ) {}

  private findOrFailStorageFileEntity({ id, bucket }: GetStorageFileEntityOptions) {
    return this.storageFileRepository.findOneOrFail({
      where: { id, bucket },
      select: ["id", "bucket", "size", "public"],
    });
  }

  getFileStream(options: GetStorageFileEntityOptions): Promise<null | Readable>;
  getFileStream(
    options: GetStorageFileEntityOptions,
    group: true,
  ): Promise<null | { readableStream: Readable; storageFileEntity: StorageFileEntity }>;

  async getFileStream(options: GetStorageFileEntityOptions, group?: true) {
    try {
      const storageFileEntity = await this.findOrFailStorageFileEntity(options);
      if (options.onlyPublic && !storageFileEntity.public) return null;
      const readableStream = await this.storageService.getFileContentStreamByID(
        storageFileEntity.bucket,
        storageFileEntity.id,
      );
      readableStream.on("error", (error) => console.error(error));
      return group ? { storageFileEntity, readableStream } : readableStream;
    } catch (e) {
      return null;
    }
  }

  async getFileBuffer(options: GetStorageFileEntityOptions) {
    try {
      const storageFileEntity = await this.findOrFailStorageFileEntity(options);
      if (options.onlyPublic && !storageFileEntity.public) return null;
      const readableStream = await this.storageService.getFileContentStreamByID(
        storageFileEntity.bucket,
        storageFileEntity.id,
      );
      return streamToBuffer(readableStream);
    } catch (e) {
      return null;
    }
  }

  private async fileExistsInDB({ id, bucket }: GetStorageFileEntityOptions) {
    return !!(await this.storageFileRepository.findOne({ where: { id, bucket } }));
  }

  private async fileExistsInFolder(options: GetStorageFileEntityOptions) {
    return await this.storageService.fileExists(options.bucket, options.id);
  }

  async fileExists(options: GetStorageFileEntityOptions) {
    const foundInDB = await this.fileExistsInDB(options);
    if (!foundInDB) return false;
    return await this.fileExistsInFolder(options);
  }

  async fileStats(options: GetStorageFileEntityOptions) {
    return await this.storageService.statFile(options.bucket, options.id);
  }

  async bucketsList() {
    return await this.storageService.getBuckets();
  }
}
