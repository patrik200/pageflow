import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class DocumentRevisionResponsibleUserFlowClearNotifiedService {
  constructor(
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private userFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
  ) {}

  @Transactional()
  async unsafeClearNotified({ responsibleUserFlowApproving: userFlow }: DocumentRevisionEntity) {
    if (userFlow === null) return;

    await this.userFlowRepository.update(
      {
        id: userFlow.id,
        deadlineDaysNotified: true,
        deadlineDaysAmount: Not(IsNull()),
        client: { id: getCurrentUser().clientId },
      },
      { deadlineDaysNotified: false },
    );
  }
}
