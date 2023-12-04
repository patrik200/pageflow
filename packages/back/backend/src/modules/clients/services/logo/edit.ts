import { ExpressMultipartFile } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService, UploadFileService } from "modules/storage";

interface EditClientLogoInterface {
  file: ExpressMultipartFile;
}

@Injectable()
export class EditClientLogoService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,
    private deleteFileService: DeleteFileService,
    private uploadFileService: UploadFileService,
  ) {}

  @Transactional()
  async editClientLogoOrFail({ file }: EditClientLogoInterface) {
    const { clientId } = getCurrentUser();
    const client = await this.clientsRepository.findOneOrFail({ where: { id: clientId }, relations: { logo: true } });
    if (client.logo) await this.deleteFileService.deleteFileOrFail(client.logo);

    const savedFile = await this.uploadFileService.uploadFileOrFail(`client.${clientId}.logo`, file, "image");

    await this.clientsRepository.update(clientId, {
      logo: { id: savedFile.id },
    });

    return savedFile;
  }
}
