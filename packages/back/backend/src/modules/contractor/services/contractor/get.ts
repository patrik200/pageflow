import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ContractorEntity } from "entities/Contractor";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetContractorsService {
  constructor(@InjectRepository(ContractorEntity) private contractorsRepository: Repository<ContractorEntity>) {}

  async getContractorOrFail(contractorId: string, options: { loadLogo?: boolean } = {}) {
    const currentUser = getCurrentUser();
    return await this.contractorsRepository.findOneOrFail({
      where: { id: contractorId, client: { id: currentUser.clientId } },
      relations: {
        logo: options.loadLogo,
      },
    });
  }
}
