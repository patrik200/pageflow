import { ExpressMultipartFile } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ContractorEntity } from "entities/Contractor";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService, UploadFileService } from "modules/storage";

import { ValidateForEditingContractorsService } from "../contractor/validate-for-editing";

interface EditContractorLogoInterface {
  file: ExpressMultipartFile;
}

@Injectable()
export class EditContractorsLogoService {
  constructor(
    @InjectRepository(ContractorEntity)
    private contractorsRepository: Repository<ContractorEntity>,
    private deleteFileService: DeleteFileService,
    private uploadFileService: UploadFileService,
    private validateService: ValidateForEditingContractorsService,
  ) {}

  @Transactional()
  async editContractorLogoOrFail(contractorId: string, { file }: EditContractorLogoInterface) {
    await this.validateService.validateContractorForEditingOrFail(contractorId);
    const contractor = await this.contractorsRepository.findOneOrFail({
      where: { id: contractorId },
      relations: { logo: true },
    });

    if (contractor.logo) await this.deleteFileService.deleteFileOrFail(contractor.logo);

    const savedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.contractors`,
      file,
      "image",
    );

    await this.contractorsRepository.update(contractorId, {
      logo: { id: savedFile.id },
    });
  }
}
