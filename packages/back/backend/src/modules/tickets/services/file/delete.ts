import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { TicketEntity } from "entities/Ticket";
import { TicketFileEntity } from "entities/Ticket/File";

import { DeleteFileService } from "modules/storage";

import { GetTicketsForEditService } from "../tickets/get-for-update";
import { TicketUpdated } from "../../events/TicketUpdated";

@Injectable()
export class DeleteTicketFilesService {
  constructor(
    @InjectRepository(TicketEntity) private ticketsRepository: Repository<TicketEntity>,
    @InjectRepository(TicketFileEntity) private ticketFilesRepository: Repository<TicketFileEntity>,
    private deleteFileService: DeleteFileService,
    private eventEmitter: EventEmitter2,
    private getTicketsForEditService: GetTicketsForEditService,
  ) {}

  @Transactional()
  async deleteTicketFileOrFail(ticketId: string, fileId: string, { emitEvents = true }: { emitEvents?: boolean } = {}) {
    const ticket = await this.getTicketsForEditService.getTicketForUpdating(ticketId);

    await this.ticketsRepository.update(ticket.id, {});

    const ticketFile = await this.ticketFilesRepository.findOneOrFail({
      where: { file: { id: fileId }, ticket: { id: ticket.id } },
      relations: { ticket: true, file: true },
    });
    await this.ticketFilesRepository.delete(ticketFile.id);
    await this.deleteFileService.deleteFileOrFail(ticketFile.file);

    if (emitEvents) {
      this.eventEmitter.emit(TicketUpdated.eventName, new TicketUpdated(ticket.id, ticket));
    }
  }
}
