import { ExpressMultipartFile, ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService, UploadFileService } from "modules/storage";

import { GetClientService } from "../client/get";

interface EditClientLogoInterface {
  file: ExpressMultipartFile;
}

@Injectable()
export class EditClientLogoService {
  constructor(
    @InjectRepository(ClientEntity) private clientRepository: Repository<ClientEntity>,
    private deleteFileService: DeleteFileService,
    private uploadFileService: UploadFileService,
    private getClientService: GetClientService,
  ) {}

  @Transactional()
  async editClientLogoOrFail({ file }: EditClientLogoInterface) {
    const currentUser = getCurrentUser();
    const client = await this.getClientService.dangerGetClientByIdOrFail(currentUser.clientId, { loadLogo: true });
    client.calculateAllCans(currentUser);
    if (!client.canUpdate) throw new ServiceError("permission", "Permission denied");

    if (client.logo) await this.deleteFileService.deleteFileOrFail(client.logo);

    const savedFile = await this.uploadFileService.uploadFileOrFail(`client.${client.id}.logo`, file, "image");

    await this.clientRepository.update(client.id, { logo: { id: savedFile.id } });

    return savedFile;
  }
}
