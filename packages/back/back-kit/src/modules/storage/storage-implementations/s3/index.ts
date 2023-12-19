import { Injectable } from "@nestjs/common";
import type { Readable } from "node:stream";
import type { BucketItem } from "minio";
import chalk from "chalk";
import { BucketItemFromList } from "minio";

import { streamToPromise } from "libs";

import { SentryTextService } from "modules/sentry";

import { S3ControllerService } from "./internal/S3ControllerService";
import { FileBufferToSaveInterface, FileStreamToSaveInterface } from "../../types";

@Injectable()
export class S3StorageService {
  constructor(private s3Controller: S3ControllerService, private sentryTextService: SentryTextService) {}

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
      this.sentryTextService.error(e, {
        context: `Check file exists ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)}`,
        contextService: "S3",
      });
      return false;
    }
  }

  async deleteFile(bucket: string, id: string) {
    try {
      await this.s3.removeObject(bucket, id);
      return true;
    } catch (e) {
      this.sentryTextService.error(e, {
        context: `Delete file ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)}`,
        contextService: "S3",
      });
      return false;
    }
  }

  async statFile(bucket: string, id: string) {
    try {
      return await this.s3.statObject(bucket, id);
    } catch (e) {
      this.sentryTextService.error(e, {
        context: `Stat file ${chalk.cyan(id)} in bucket ${chalk.cyan(bucket)}`,
        contextService: "S3",
      });
      return null;
    }
  }

  async createBucketIfNotExists(bucket: string) {
    try {
      const bucketExists = await this.s3.bucketExists(bucket);
      if (!bucketExists) await this.s3.makeBucket(bucket);
      return true;
    } catch (e) {
      this.sentryTextService.error(e, {
        context: `Create bucket ${chalk.cyan(bucket)}`,
        contextService: "S3",
      });
      return false;
    }
  }

  async deleteBucketIfExists(bucket: string) {
    try {
      const bucketExists = await this.s3.bucketExists(bucket);
      if (!bucketExists) {
        this.sentryTextService.info(`Bucket ${chalk.cyan(bucket)} does not exist`, {
          context: `Delete bucket error`,
          contextService: "S3",
        });
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
      this.sentryTextService.error(e, {
        context: `Delete bucket ${chalk.cyan(bucket)}`,
        contextService: "S3",
      });
      return false;
    }
  }

  async getBuckets() {
    try {
      return await this.s3.listBuckets();
    } catch (e) {
      this.sentryTextService.error(e, {
        context: `Get buckets list`,
        contextService: "S3",
      });
      return [] as BucketItemFromList[];
    }
  }

  async getBucketFiles(bucket: string) {
    try {
      return await streamToPromise<BucketItem[]>(this.s3.listObjects(bucket));
    } catch (e) {
      this.sentryTextService.error(e, {
        context: `Get bucket ${chalk.cyan(bucket)} files`,
        contextService: "S3",
      });
      return [] as BucketItem[];
    }
  }
}
