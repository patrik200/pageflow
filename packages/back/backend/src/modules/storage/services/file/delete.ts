import { FileUploaderService, StorageFileEntity } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class DeleteFileService {
  constructor(
    private fileUploaderService: FileUploaderService,
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
  ) {}

  @Transactional()
  async deleteFileOrFail(file: StorageFileEntity) {
    const client = await this.clientsRepository.findOneOrFail({ where: { id: getCurrentUser().clientId } });
    await this.clientsRepository.decrement({ id: client.id }, "usedFileSizeByte", file.size);
    await this.fileUploaderService.deleteFileOrFail(file);
  }
}
