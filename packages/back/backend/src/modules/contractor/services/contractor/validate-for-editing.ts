import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContractorEntity } from "entities/Contractor";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class ValidateForEditingContractorsService {
  constructor(
    @InjectRepository(ContractorEntity)
    private contractorsRepository: Repository<ContractorEntity>,
  ) {}

  async validateContractorForEditingOrFail(contractorId: string) {
    const currentUser = getCurrentUser();
    await this.contractorsRepository.findOneOrFail({
      where: { id: contractorId, client: { id: currentUser.clientId } },
    });
  }
}
