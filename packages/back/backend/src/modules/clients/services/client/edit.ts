import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

interface EditClientInterface {
  name?: string;
}

@Injectable()
export class EditClientService {
  constructor(@InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>) {}

  @Transactional()
  async editClientOrFail({ name }: EditClientInterface) {
    const { clientId } = getCurrentUser();
    await this.clientsRepository.update(clientId, Object.assign({}, name ? { name } : undefined));
  }
}
