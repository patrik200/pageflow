import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ContractorEntity } from "entities/Contractor";

import { getCurrentUser } from "modules/auth";

interface CreateContractorInterface {
  name: string;
}

@Injectable()
export class CreateContractorsService {
  constructor(
    @InjectRepository(ContractorEntity)
    private contractorsRepository: Repository<ContractorEntity>,
  ) {}

  @Transactional()
  async createContractorOrFail({ name }: CreateContractorInterface) {
    const currentUser = getCurrentUser();
    const contractor = await this.contractorsRepository.save({
      name,
      client: { id: currentUser.clientId },
    });

    return contractor.id;
  }
}
