import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElasticService, ExpressMultipartFile, FileExtensionsService } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketEntity } from "entities/Ticket";
import { TicketFileEntity } from "entities/Ticket/File";

import { getCurrentUser } from "modules/auth";
import { UploadFileService } from "modules/storage";

import { GetTicketsForEditService } from "../tickets/get-for-update";
import { TicketUpdated } from "../../events/TicketUpdated";

@Injectable()
export class UploadTicketFilesService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    @InjectRepository(TicketFileEntity) private ticketFilesRepository: Repository<TicketFileEntity>,
    private uploadFileService: UploadFileService,
    private eventEmitter: EventEmitter2,
    private getTicketsForEditService: GetTicketsForEditService,
    private fileExtensionsService: FileExtensionsService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async uploadTicketFileOrFail(ticketId: string, file: ExpressMultipartFile) {
    const ticket = await this.getTicketsForEditService.getTicketForUpdating(ticketId);

    await this.ticketsRepository.update(ticket.id, {});

    const uploadedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${getCurrentUser().clientId}.tickets`,
      file,
    );

    const addToElastic = this.fileExtensionsService.compareDocumentExtensionPresetAndExtension(
      ["excel", "word", "pdf"],
      this.fileExtensionsService.getExtension(uploadedFile.id),
    );

    if (addToElastic) {
      await this.elasticService.addDocumentAttachmentOrFail(
        this.elasticService.getDocumentId("tickets", uploadedFile.id),
        "attachments",
        { id: uploadedFile.id, fileName: uploadedFile.fileName, data: uploadedFile.buffer },
        { waitForIndex: false },
      );
    }

    const savedTicketFile = await this.ticketFilesRepository.save({
      file: { id: uploadedFile.id },
      ticket: { id: ticket.id },
    });

    this.eventEmitter.emit(TicketUpdated.eventName, new TicketUpdated(ticket.id, ticket));

    return { id: savedTicketFile.id, file: uploadedFile };
  }
}
