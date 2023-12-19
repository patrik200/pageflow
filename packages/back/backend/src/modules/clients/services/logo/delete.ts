import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ServiceError } from "@app/back-kit";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService } from "modules/storage";

import { GetClientService } from "../client/get";

@Injectable()
export class DeleteClientLogoService {
  constructor(
    @InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>,
    private deleteFileService: DeleteFileService,
    private getClientService: GetClientService,
  ) {}

  @Transactional()
  private async rawDeleteClientLogoOrFail(client: ClientEntity) {
    if (!client.logo) return;
    await this.deleteFileService.deleteFileOrFail(client.logo);
    await this.clientRepository.update(client.id, { logo: null });
  }

  @Transactional()
  async deleteClientLogoOrFail() {
    const currentUser = getCurrentUser();
    const client = await this.getClientService.dangerGetClientByIdOrFail(currentUser.clientId, { loadLogo: true });
    client.calculateAllCans(currentUser);
    if (!client.canUpdate) throw new ServiceError("permission", "Permission denied");
    await this.rawDeleteClientLogoOrFail(client);
  }

  @Transactional()
  async dangerDeleteClientLogoOrFail(clientId: string) {
    const client = await this.getClientService.dangerGetClientByIdOrFail(clientId, { loadLogo: true });
    await this.rawDeleteClientLogoOrFail(client);
  }
}
