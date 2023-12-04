import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ContractorEntity } from "entities/Contractor";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetContractorsListService {
  constructor(@InjectRepository(ContractorEntity) private contractorsRepository: Repository<ContractorEntity>) {}

  async getContractorsListOrFail(options: { loadLogo?: boolean } = {}) {
    const currentUser = getCurrentUser();
    return await this.contractorsRepository.find({
      where: { client: { id: currentUser.clientId } },
      relations: {
        logo: options.loadLogo,
      },
    });
  }
}
