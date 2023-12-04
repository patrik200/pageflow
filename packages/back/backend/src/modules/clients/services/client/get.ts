import { Injectable } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetClientsService {
  constructor(@InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>) {}

  async getClientByIdOrFail(id: string, options: { loadLogo?: boolean } = {}) {
    return await this.clientsRepository.findOneOrFail({
      where: { id },
      relations: { logo: options.loadLogo },
    });
  }

  async getCurrentClientOrFail(options: { loadLogo?: boolean } = {}) {
    const { clientId } = getCurrentUser();
    return await this.getClientByIdOrFail(clientId, options);
  }

  async getClientTenant(domain: string, options: { loadLogo?: boolean } = {}) {
    return await this.clientsRepository.findOneOrFail({ where: { domain }, relations: { logo: options.loadLogo } });
  }

  async getClientIdByDomain(domain: string) {
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
