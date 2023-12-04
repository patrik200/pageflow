import { Injectable, Logger } from "@nestjs/common";
import type { Readable } from "node:stream";
import type { BucketItem } from "minio";
import chalk from "chalk";
import { BucketItemFromList } from "minio";

import { errorLogBeautifier, streamToPromise } from "libs";

import { S3ControllerService } from "./internal/S3ControllerService";
import { FileBufferToSaveInterface, FileStreamToSaveInterface } from "../../types";

@Injectable()
export class S3StorageService {
  constructor(private s3Controller: S3ControllerService) {}

  private get s3() {
    return this.s3Controller.s3;
  }

  async saveFileBuffer(file: Omit<FileBufferToSaveInterface, "name">) {
    return await this.s3.putObject(file.bucket, file.id, file.buffer);
  }

  async saveFileStream(file: Omit<FileStreamToSaveInterface, "name">) {
    return await this.s3.putObject(file.bucket, file.id, file.stream as Readable);
  }

  async getFileContentStreamByID(bucket: string, id: string) {
    return await this.s3.getObject(bucket, id);
  }

  async fileExists(bucket: string, id: string) {
    try {
      await this.statFile(bucket, id);
      return true;
    } catch (e) {
      Logger.error(`Check file exists ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)} error:`, "S3");
      errorLogBeautifier(e);
      return false;
    }
  }

  async deleteFile(bucket: string, id: string) {
    try {
      await this.s3.removeObject(bucket, id);
      return true;
    } catch (e) {
      Logger.error(`Delete file ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)} error:`, "S3");
      errorLogBeautifier(e);
      return false;
    }
  }

  async statFile(bucket: string, id: string) {
    try {
      return await this.s3.statObject(bucket, id);
    } catch (e) {
      Logger.error(`Stat file ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)} error:`, "S3");
      errorLogBeautifier(e);
      return null;
    }
  }

  async createBucketIfNotExists(bucket: string) {
    try {
      const bucketExists = await this.s3.bucketExists(bucket);
      if (!bucketExists) await this.s3.makeBucket(bucket);
      return true;
    } catch (e) {
      Logger.error(`Create bucket ${chalk.cyan(bucket)} error:`, "S3");
      errorLogBeautifier(e);
      return false;
    }
  }

  async deleteBucketIfExists(bucket: string) {
    try {
      const bucketExists = await this.s3.bucketExists(bucket);
      if (!bucketExists) {
        Logger.error(`Delete bucket error: bucket ${chalk.cyan(bucket)} does not exist`, "S3");
        return false;
      }
      const files = await this.getBucketFiles(bucket);
      await this.s3.removeObjects(
        bucket,
        files.map((file) => file.name),
      );
      await this.s3.removeBucket(bucket);
      return true;
    } catch (e) {
      Logger.error(`Delete bucket ${chalk.cyan(bucket)} error:`, "S3");
      errorLogBeautifier(e);
      return false;
    }
  }

  async getBuckets() {
    try {
      return await this.s3.listBuckets();
    } catch (e) {
      Logger.error(`Get buckets list error:`, "S3");
      errorLogBeautifier(e);
      return [] as BucketItemFromList[];
    }
  }

  async getBucketFiles(bucket: string) {
    try {
      return await streamToPromise<BucketItem[]>(this.s3.listObjects(bucket));
    } catch (e) {
      Logger.error(`Get bucket ${chalk.cyan(bucket)} files error:`, "S3");
      errorLogBeautifier(e);
      return [] as BucketItem[];
    }
  }
}
