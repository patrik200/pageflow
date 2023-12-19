import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ServiceError } from "@app/back-kit";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";

import { GetClientService } from "./get";

interface EditClientInterface {
  name?: string;
}

@Injectable()
export class EditClientService {
  constructor(
    @InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>,
    private getClientService: GetClientService,
  ) {}

  @Transactional()
  async editClientOrFail(updateOptions: EditClientInterface) {
    const currentUser = getCurrentUser();
    const client = await this.getClientService.dangerGetClientByIdOrFail(currentUser.clientId);
    client.calculateAllCans(currentUser);
    if (!client.canUpdate) throw new ServiceError("permission", "Permission denied");
    await this.clientsRepository.update(
      currentUser.clientId,
      Object.assign({}, updateOptions.name ? { name: updateOptions.name } : undefined),
    );
  }

  @Transactional()
  async incrementCreatedProjectsCount() {
    const currentUser = getCurrentUser();
    await this.clientsRepository.update(currentUser.clientId, {
      createdProjectsCount: () => "createdProjectsCount + 1",
    });
  }
}
