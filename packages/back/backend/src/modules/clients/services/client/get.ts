import { Injectable } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetClientService {
  constructor(@InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>) {}

  async dangerGetClientByIdOrFail(id: string, options: { loadLogo?: boolean } = {}) {
    return await this.clientsRepository.findOneOrFail({
      where: { id },
      relations: { logo: options.loadLogo },
    });
  }

  async getCurrentClientOrFail(options: { loadLogo?: boolean } = {}) {
    const { clientId } = getCurrentUser();
    return await this.dangerGetClientByIdOrFail(clientId, options);
  }

  async getClientByDomainOrFail(domain: string, options: { loadLogo?: boolean } = {}) {
    return await this.clientsRepository.findOneOrFail({ where: { domain }, relations: { logo: options.loadLogo } });
  }

  async getClientIdByDomainOrFail(domain: string) {
    const client = await this.clientsRepository.findOne({ where: { domain } });
    if (!client) return null;
    return client.id;
  }

  async getCurrentClientStorageUsageInfoOrFail() {
    const client = await this.getCurrentClientOrFail();

    const hasFilesMemoryLimit = client.filesMemoryLimitByte !== null;

    if (hasFilesMemoryLimit)
      return {
        usedFileSize: client.usedFileSizeByte,
        filesMemoryLimit: client.filesMemoryLimitByte,
        haveFilesMemoryLimit: true,
      };

    return {
      usedFileSize: client.usedFileSizeByte,
      filesMemoryLimit: -1,
      haveFilesMemoryLimit: false,
    };
  }

  async dangerGetClientsList(options?: FindManyOptions<ClientEntity>) {
    return await this.clientsRepository.find(options);
  }
}
