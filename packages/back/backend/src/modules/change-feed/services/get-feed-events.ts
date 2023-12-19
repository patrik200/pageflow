import { ChangeFeedEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ChangeFeedEventEntity } from "entities/ChangeFeed";

import { getCurrentUser } from "modules/auth";
import { GetTicketService } from "modules/tickets";
import { GetProjectService } from "modules/projects";
import { GetCorrespondenceService } from "modules/correspondences";
import { GetCorrespondenceRevisionService } from "modules/correspondence-revisions";
import { GetDocumentService } from "modules/documents";
import { GetDocumentRevisionService } from "modules/document-revisions";

interface ChangeFeedEventOptions {
  entityType: ChangeFeedEntityType;
  entityId: string;
}

@Injectable()
export class GetChangeFeedEventsService {
  constructor(
    @InjectRepository(ChangeFeedEventEntity) private changeFeedEventRepository: Repository<ChangeFeedEventEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => GetTicketService)) private getTicketService: GetTicketService,
    @Inject(forwardRef(() => GetCorrespondenceService)) private getCorrespondenceService: GetCorrespondenceService,
    @Inject(forwardRef(() => GetCorrespondenceRevisionService))
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
    @Inject(forwardRef(() => GetDocumentRevisionService))
    private getDocumentRevisionService: GetDocumentRevisionService,
  ) {}

  private async validatePermissionAccess(options: ChangeFeedEventOptions) {
    if (options.entityType === ChangeFeedEntityType.PROJECT) {
      await this.getProjectService.getProjectOrFail(options.entityId);
      return;
    }

    if (options.entityType === ChangeFeedEntityType.TICKET) {
      await this.getTicketService.getTicketOrFail(options.entityId, "slug");
      return;
    }

    if (options.entityType === ChangeFeedEntityType.CORRESPONDENCE) {
      await this.getCorrespondenceService.getCorrespondenceOrFail(options.entityId);
      return;
    }

    if (options.entityType === ChangeFeedEntityType.CORRESPONDENCE_REVISION) {
      await this.getCorrespondenceRevisionService.getRevisionOrFail(options.entityId);
      return;
    }

    if (options.entityType === ChangeFeedEntityType.DOCUMENT) {
      await this.getDocumentService.getDocumentOrFail(options.entityId);
      return;
    }

    if (options.entityType === ChangeFeedEntityType.DOCUMENT_REVISION) {
      await this.getDocumentRevisionService.getRevisionOrFail(options.entityId);
      return;
    }
  }

  @Transactional()
  async getChangeFeedEvents(options: ChangeFeedEventOptions) {
    await this.validatePermissionAccess(options);

    return await this.changeFeedEventRepository.find({
      where: {
        client: { id: getCurrentUser().clientId },
        entityId: options.entityId,
        entityType: options.entityType,
      },
      order: { createdAt: "ASC" },
      relations: {
        author: {
          avatar: true,
        },
      },
    });
  }
}
