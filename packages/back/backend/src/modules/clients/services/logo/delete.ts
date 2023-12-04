import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService } from "modules/storage";

@Injectable()
export class DeleteClientLogoService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
    private deleteFileService: DeleteFileService,
  ) {}

  @Transactional()
  async deleteClientLogoOrFail() {
    const { clientId } = getCurrentUser();
    const client = await this.clientsRepository.findOneOrFail({ where: { id: clientId }, relations: { logo: true } });
    if (!client.logo) return;
    await this.deleteFileService.deleteFileOrFail(client.logo);
    await this.clientsRepository.update(clientId, { logo: null });
  }
}
