import { FileUploaderService, ExpressMultipartFile, CompareDocumentExtensionPreset, ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class UploadFileService {
  constructor(
    private fileUploaderService: FileUploaderService,
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
  ) {}

  @Transactional()
  async uploadFileOrFail(bucket: string, file: ExpressMultipartFile, extensionPreset?: CompareDocumentExtensionPreset) {
    const client = await this.clientsRepository.findOneOrFail({ where: { id: getCurrentUser().clientId } });

    // todo https://pageflow.gitlab.yandexcloud.net/pageflow/pageflow-main/-/issues/59
    if (client.filesMemoryLimitByte !== null) {
      if (client.usedFileSizeByte + file.size > client.filesMemoryLimitByte)
        throw new ServiceError("usedFileSizeByte", "Достигнут лимит используемой памяти.");
    }

    await this.clientsRepository.increment({ id: client.id }, "usedFileSizeByte", file.size);

    return await this.fileUploaderService.uploadFileOrFail(bucket, file, extensionPreset);
  }
}
