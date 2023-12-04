import { TypeormUpdateEntity } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ContractorEntity } from "entities/Contractor";

import { ValidateForEditingContractorsService } from "./validate-for-editing";

interface EditContractorInterface {
  name?: string;
}

@Injectable()
export class EditContractorsService {
  constructor(
    @InjectRepository(ContractorEntity)
    private contractorsRepository: Repository<ContractorEntity>,
    private validateService: ValidateForEditingContractorsService,
  ) {}

  @Transactional()
  async editContractorOrFail(contractorId: string, { name }: EditContractorInterface) {
    await this.validateService.validateContractorForEditingOrFail(contractorId);

    const updateOptions: TypeormUpdateEntity<ContractorEntity> = {};
    if (name) updateOptions.name = name;

    await this.contractorsRepository.update(contractorId, updateOptions);
  }
}
