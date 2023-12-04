import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class DeleteDocumentRevisionUserFlowService {
  constructor(
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private userFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
  ) {}

  @Transactional()
  async deleteOrFail(id: string) {
    const currentUser = getCurrentUser();
    const userFlow = await this.userFlowRepository.findOneOrFail({
      where: { client: { id: currentUser.clientId }, id },
    });

    await this.userFlowRepository.delete(userFlow.id);
  }
}
