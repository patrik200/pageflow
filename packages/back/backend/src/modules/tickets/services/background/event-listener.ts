import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Transactional } from "typeorm-transactional";
import { ChangeFeedEntityType } from "@app/shared-enums";
import { SentryTextService } from "@app/back-kit";

import { TicketEntity } from "entities/Ticket";

import {
  ChangeFeedEventChangeDetectionService,
  CreateChangeFeedEventService,
  DeleteChangeFeedEventService,
} from "modules/change-feed";
import { AppNotification, NotificationService } from "modules/notifications";
import { GetTicketBoardService } from "modules/ticket-boards";

import { GetTicketService } from "../tickets/get";
import { TicketCreated } from "../../events/TicketCreated";
import { TicketDeleted } from "../../events/TicketDeleted";
import { TicketUpdated } from "../../events/TicketUpdated";

@Injectable()
export class TicketEventListenerService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private getTicketService: GetTicketService,
    @Inject(forwardRef(() => GetTicketBoardService)) private getTicketBoardService: GetTicketBoardService,
    @Inject(forwardRef(() => CreateChangeFeedEventService))
    private createChangeFeedEventService: CreateChangeFeedEventService,
    @Inject(forwardRef(() => DeleteChangeFeedEventService))
    private deleteChangeFeedEventService: DeleteChangeFeedEventService,
    @Inject(forwardRef(() => ChangeFeedEventChangeDetectionService))
    private feedEventChangeDetectionService: ChangeFeedEventChangeDetectionService,
    @Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
    private sentryTextService: SentryTextService,
  ) {}

  @Transactional()
  private async handleTicketCreated(ticketId: string, triggerUserId: string) {
    const ticket = await this.getTicketService.getTicketOrFail(ticketId, "id", {
      checkPermissions: false,
      loadClient: true,
      loadResponsible: true,
      loadCustomer: true,
      loadAuthor: true,
    });

    const board = await this.getTicketBoardService.getTicketBoardOrFail(ticket.board.id, {
      checkPermissions: false,
      loadPermissions: true,
    });

    const notification = new AppNotification(
      "Создан новый запрос",
      {
        name: ticket.name,
        id: ticket.slug,
        authorName: ticket.author.name,
        createdAt: ticket.createdAt,
      },
      { emailTemplateName: "TicketCreated" },
      ticket.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    if (ticket.responsible) await notifyUser(ticket.responsible.id);
    if (ticket.customer) await notifyUser(ticket.customer.id);
    await Promise.all(board.permissions!.map((permission) => notifyUser(permission.user.id)));
  }

  @Transactional()
  private async handleTicketDeleted(ticketId: string) {
    await this.deleteChangeFeedEventService.deleteAllChangeFeedEventsOrFail({
      entityId: ticketId,
      entityType: ChangeFeedEntityType.TICKET,
    });
  }

  @Transactional()
  private async handleTicketUpdated(ticketId: string, oldTicket: TicketEntity, triggerUserId: string) {
    const ticket = await this.getTicketService.getTicketOrFail(ticketId, "id", {
      checkPermissions: false,
      loadClient: true,
      loadStatus: true,
      loadType: true,
      loadCustomer: true,
      loadResponsible: true,
      loadFiles: true,
    });

    const board = await this.getTicketBoardService.getTicketBoardOrFail(ticket.board.id, {
      checkPermissions: false,
      loadPermissions: true,
    });

    await this.createChangeFeedEventService.createChangeFeedEventOrFail({
      entityId: ticket.slug,
      entityType: ChangeFeedEntityType.TICKET,
      eventType: "updated",
      data: {
        name: this.feedEventChangeDetectionService.change(ticket.name, oldTicket.name),
        description: this.feedEventChangeDetectionService.change(ticket.description, oldTicket.description),
        deadline: this.feedEventChangeDetectionService.change(ticket.deadlineAt, oldTicket.deadlineAt),
        status: this.feedEventChangeDetectionService.changeForDictionary(ticket.status, oldTicket.status),
        priority: this.feedEventChangeDetectionService.change(ticket.priority, oldTicket.priority),
        responsible: this.feedEventChangeDetectionService.changeForEntity(ticket.responsible, oldTicket.responsible),
        customer: this.feedEventChangeDetectionService.changeForEntity(ticket.customer, oldTicket.customer),
        type: this.feedEventChangeDetectionService.changeForDictionary(ticket.type, oldTicket.type),
        files: this.feedEventChangeDetectionService.changeForFilesList(ticket.files, oldTicket.files),
      },
    });

    const notification = new AppNotification(
      "Обновление запроса",
      {
        name: ticket.name,
        id: ticket.slug,
        updatedAt: ticket.updatedAt,
      },
      { emailTemplateName: "TicketUpdated" },
      ticket.client.domain,
      "",
    );

    const notifyUser = this.notificationService.notifyUserFabric(notification, triggerUserId);

    if (ticket.responsible) await notifyUser(ticket.responsible.id);
    if (ticket.customer) await notifyUser(ticket.customer.id);
    await Promise.all(board.permissions!.map((permission) => notifyUser(permission.user.id)));
  }

  onApplicationBootstrap() {
    this.eventEmitter.on(TicketCreated.eventName, (event: TicketCreated) =>
      this.handleTicketCreated(event.ticketId, event.triggerUserId).catch((e) =>
        this.sentryTextService.error(e, {
          context: TicketCreated.eventName,
          contextService: TicketEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(TicketDeleted.eventName, (event: TicketDeleted) =>
      this.handleTicketDeleted(event.ticketId).catch((e) =>
        this.sentryTextService.error(e, {
          context: TicketDeleted.eventName,
          contextService: TicketEventListenerService.name,
        }),
      ),
    );
    this.eventEmitter.on(TicketUpdated.eventName, (event: TicketUpdated) =>
      this.handleTicketUpdated(event.ticketId, event.oldTicket, event.triggerUserId).catch((e) =>
        this.sentryTextService.error(e, {
          context: TicketUpdated.eventName,
          contextService: TicketEventListenerService.name,
        }),
      ),
    );
  }
}
