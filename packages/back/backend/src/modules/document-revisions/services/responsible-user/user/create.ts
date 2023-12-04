import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentRevisionResponsibleUserEntity } from "entities/Document/Document/Revision/Approving/UserApproving";

import { GetDocumentService } from "modules/documents";
import { GetUserService } from "modules/users";

@Injectable()
export class CreateDocumentRevisionResponsibleUserService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserEntity)
    private revisionResponsibleUserRepository: Repository<DocumentRevisionResponsibleUserEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  async createResponsibleUserIfNeedOrFail(revisionId: string, userId: string | null, documentId: string) {
    if (userId) {
      const user = await this.getUserService.getUserOrFail(userId, "id");
      const responsibleUser = await this.revisionResponsibleUserRepository.save({
        revision: { id: revisionId },
        user: { id: user.id },
      });
      await this.revisionsRepository.update(revisionId, {
        responsibleUserApproving: { id: responsibleUser.id },
      });
      return;
    }

    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadResponsibleUser: true,
    });

    if (document.responsibleUser) {
      const responsibleUser = await this.revisionResponsibleUserRepository.save({
        revision: { id: revisionId },
        user: { id: document.responsibleUser.id },
      });
      await this.revisionsRepository.update(revisionId, {
        responsibleUserApproving: { id: responsibleUser.id },
      });
    }
  }
}
