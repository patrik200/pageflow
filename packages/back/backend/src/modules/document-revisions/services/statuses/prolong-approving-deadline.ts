import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";
import { DocumentRevisionUpdated } from "../../events/RevisionUpdated";

interface DocumentRevisionProlongApprovingDeadlineOptions {
  approvingDeadline: Date;
}

@Injectable()
export class DocumentRevisionProlongApprovingDeadlineService {
  constructor(
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async prolongApprovingDeadlineOrFail(revisionId: string, options: DocumentRevisionProlongApprovingDeadlineOptions) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canRunProlongApprovingDeadline)
      throw new ServiceError("user", "Вы не можете продлить крайнюю дату утверждения этой ревизии");

    if (options.approvingDeadline <= revision.approvingDeadline!)
      throw new ServiceError("user", "Крайняя дата утверждения не может быть меньше той что установлена у ревизии");

    await this.revisionsRepository.update(revision.id, {
      approvingDeadline: options.approvingDeadline,
    });

    this.eventEmitter.emit(DocumentRevisionUpdated.eventName, new DocumentRevisionUpdated(revision.id, revision));
  }
}
