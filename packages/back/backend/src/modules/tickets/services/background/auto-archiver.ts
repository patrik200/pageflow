import { INTLService, INTLServiceLang, SentryTextService } from "@app/back-kit";
import { config } from "@app/core-config";
import { DictionaryTypes } from "@app/shared-enums";
import { forwardRef, Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { setAsyncInterval } from "@worksolutions/utils";
import { LessThanOrEqual, Repository } from "typeorm";
import chalk from "chalk";

import { TicketEntity } from "entities/Ticket";

import { GetDictionaryValueService } from "modules/dictionary";

@Injectable()
export class TicketAutoArchiverService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(INTLServiceLang.RU) private intlService: INTLService,
    @InjectRepository(TicketEntity) private ticketRepository: Repository<TicketEntity>,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    private sentryTextService: SentryTextService,
  ) {}

  private async checkTicket(ticket: TicketEntity) {
    const archivedStatus = await this.getDictionaryValueService.dangerGetDictionaryValueOrFail(
      "archived",
      DictionaryTypes.TICKET_STATUS,
    );

    await this.ticketRepository.update(ticket.id, { status: { id: archivedStatus.id } });
  }

  private async getTicketsList(autoArchivePeriodDate: Date) {
    return await this.ticketRepository.find({
      where: {
        status: { key: "finished", dictionary: { type: DictionaryTypes.TICKET_STATUS } },
        updatedAt: LessThanOrEqual(autoArchivePeriodDate),
      },
      relations: {
        status: {
          dictionary: true,
        },
      },
    });
  }

  private async checkTickets() {
    const autoArchivePeriodDate = this.intlService
      .getCurrentDateTime()
      .minus({ day: config.tickets.autoArchiveAfterDays })
      .toJSDate();

    const tickets = await this.getTicketsList(autoArchivePeriodDate);

    for (const ticket of tickets) {
      try {
        await this.checkTicket(ticket);
      } catch (e) {
        this.sentryTextService.error(e, {
          context: "check ticket",
          contextService: TicketAutoArchiverService.name,
        });
      }
    }
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkTickets();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.tickets.autoArchiveCheckIntervalMs}ms`)}]`,
      TicketAutoArchiverService.name,
    );
    this.disposeTimer = setAsyncInterval(() => this.checkTickets(), config.tickets.autoArchiveCheckIntervalMs);
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}
