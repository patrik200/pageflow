import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { DictionaryTypes, DocumentRevisionActiveStatuses, ProjectsStatus } from "@app/shared-enums";

import { TicketEntity } from "entities/Ticket";
import { ProjectEntity } from "entities/Project";
import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";
import { GetDictionaryValueService } from "modules/dictionary";

@Injectable()
export class GetStatisticsService {
  constructor(
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(DocumentRevisionEntity) private documentRevisionRepository: Repository<DocumentRevisionEntity>,
  ) {}

  private async getTicketStatusesQuery() {
    const [finishedStatus, archivedStatus] = await Promise.all([
      this.getDictionaryValueService.getDictionaryValueOrFail("finished", DictionaryTypes.TICKET_STATUS),
      this.getDictionaryValueService.getDictionaryValueOrFail("archived", DictionaryTypes.TICKET_STATUS),
    ]);
    return Not(In([finishedStatus.id, archivedStatus.id]));
  }

  @Transactional()
  private async getTicketsWhereIAmAnAuthor() {
    const currentUser = getCurrentUser();
    return await this.ticketRepository.count({
      where: {
        client: { id: currentUser.clientId },
        author: { id: currentUser.userId },
        status: await this.getTicketStatusesQuery(),
      },
    });
  }

  @Transactional()
  private async getTicketsWhereIAmAnCustomer() {
    const currentUser = getCurrentUser();
    return await this.ticketRepository.count({
      where: {
        client: { id: currentUser.clientId },
        customer: { id: currentUser.userId },
        status: await this.getTicketStatusesQuery(),
      },
    });
  }

  @Transactional()
  private async getTicketsWhereIAmAnResponsible() {
    const currentUser = getCurrentUser();
    return await this.ticketRepository.count({
      where: {
        client: { id: currentUser.clientId },
        responsible: { id: currentUser.userId },
        status: await this.getTicketStatusesQuery(),
      },
    });
  }

  @Transactional()
  private async getProjectWhereIAmAnResponsible() {
    const currentUser = getCurrentUser();
    return await this.projectRepository.count({
      where: {
        client: { id: currentUser.clientId },
        responsible: { id: currentUser.userId },
        status: ProjectsStatus.IN_PROGRESS,
      },
    });
  }

  @Transactional()
  private async getDocumentRevisionsWhereIAmAnResponsible() {
    const currentUser = getCurrentUser();
    return await this.documentRevisionRepository.count({
      where: [
        { responsibleUserApproving: { user: { id: currentUser.userId } } },
        { responsibleUserFlowApproving: { reviewer: { user: { id: currentUser.userId } } } },
        { responsibleUserFlowApproving: { rows: { users: { user: { id: currentUser.userId } } } } },
      ].map((obj) => ({
        ...obj,
        document: { client: { id: currentUser.clientId } },
        status: In(DocumentRevisionActiveStatuses),
      })),
    });
  }

  @Transactional()
  async getStatisticsOrFail() {
    const [
      ticketsWhereIAmAnAuthor,
      ticketsWhereIAmAnCustomer,
      ticketsWhereIAmAnResponsible,
      projectWhereIAmAnResponsible,
      documentRevisionsWhereIAmAnResponsible,
    ] = await Promise.all([
      this.getTicketsWhereIAmAnAuthor(),
      this.getTicketsWhereIAmAnCustomer(),
      this.getTicketsWhereIAmAnResponsible(),
      this.getProjectWhereIAmAnResponsible(),
      this.getDocumentRevisionsWhereIAmAnResponsible(),
    ]);

    return {
      ticketsWhereIAmAnAuthor,
      ticketsWhereIAmAnCustomer,
      ticketsWhereIAmAnResponsible,
      projectWhereIAmAnResponsible,
      documentRevisionsWhereIAmAnResponsible,
    };
  }
}
