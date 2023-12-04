import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import {
  ControllerPaginatedResponse,
  ControllerResponse,
  ServiceError,
  StorageFileDTO,
  withPagination,
} from "@app/back-kit";
import { PaginatedFindResult, PaginationQueryInterface } from "@app/kit";

import { TicketEntity } from "entities/Ticket";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteTicketFilesService } from "../services/file/delete";
import { UploadTicketFilesService } from "../services/file/upload";
import { CreateTicketService } from "../services/tickets/create";
import { DeleteTicketService } from "../services/tickets/delete";
import { EditTicketsService } from "../services/tickets/edit";
import { GetTicketService } from "../services/tickets/get";
import { GetTicketsListService } from "../services/tickets/get-list";
import { ReorderTicketsService } from "../services/tickets/reorder";

import { RequestReorderTicketDTO } from "../dto/edit/ReorderTicket";
import { RequestCreateTicketDTO } from "../dto/edit/CreateTicket";
import { RequestUpdateTicketDTO } from "../dto/edit/UpdateTicket";
import {
  RequestGetTicketsDTO,
  ResponseTicketDTO,
  ResponseTicketDetailDTO,
  ResponseTicketsListDTO,
} from "../dto/get/Ticket";

@Controller("tickets")
export class TicketsController {
  constructor(
    private getTicketService: GetTicketService,
    private createTicketService: CreateTicketService,
    private getTicketsListService: GetTicketsListService,
    private deleteTicketService: DeleteTicketService,
    private uploadTicketFilesService: UploadTicketFilesService,
    private reorderTicketsService: ReorderTicketsService,
    private deleteTicketFilesService: DeleteTicketFilesService,
    private editTicketsService: EditTicketsService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async ticketsList(
    @withPagination({ optional: true }) pagination: PaginationQueryInterface | null,
    @Query() queryParams: RequestGetTicketsDTO,
  ) {
    const tickets = await this.getTicketsListService.getTicketsListOrFail(
      {
        boardId: queryParams.boardId,
        pagination: pagination ?? undefined,
        search: queryParams.search,
        searchInAttachments: queryParams.searchInAttachments,
        sorting: queryParams.sorting,
        authorId: queryParams.authorId,
        responsibleId: queryParams.responsibleId,
        customerId: queryParams.customerId,
        priority: queryParams.priority,
        typeKey: queryParams.typeKey,
        statusKey: queryParams.statusKey,
        excludeArchived: queryParams.excludeArchived,
      },
      {
        loadFavourites: true,
        loadResponsible: true,
        loadResponsibleAvatar: true,
        loadCustomer: true,
        loadCustomerAvatar: true,
        loadFiles: true,
        loadStatus: true,
        loadType: true,
      },
    );

    if (pagination !== null)
      return new ControllerPaginatedResponse(ResponseTicketDTO, tickets as PaginatedFindResult<TicketEntity>);

    return new ControllerResponse(ResponseTicketsListDTO, { list: tickets });
  }

  @Get(":ticketId")
  @withUserAuthorized([UserRole.USER])
  async ticketDetail(@Param("ticketId") ticketId: string) {
    const ticket = await this.getTicketService.getTicketOrFail(ticketId, {
      loadFavourites: true,
      loadResponsible: true,
      loadResponsibleAvatar: true,
      loadCustomer: true,
      loadCustomerAvatar: true,
      loadAuthor: true,
      loadAuthorAvatar: true,
      loadFiles: true,
      loadStatus: true,
      loadType: true,
    });

    return new ControllerResponse(ResponseTicketDetailDTO, ticket);
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createTicket(@Body() body: RequestCreateTicketDTO) {
    const ticketId = await this.createTicketService.createTicketOrFail(body.boardId, {
      statusKey: body.statusKey,
      typeKey: body.typeKey,
      name: body.name,
      description: body.description,
      deadlineAt: body.deadlineAt,
      responsibleId: body.responsibleId,
      customerId: body.customerId,
      priority: body.priority,
    });

    return new ControllerResponse(ResponseIdDTO, { id: ticketId });
  }

  @Patch(":ticketId")
  @withUserAuthorized([UserRole.USER])
  async updateTicket(@Param("ticketId") ticketId: string, @Body() body: RequestUpdateTicketDTO) {
    await this.editTicketsService.updateTicketOrFail(ticketId, {
      name: body.name,
      description: body.description,
      deadlineAt: body.deadlineAt,
      responsibleId: body.responsibleId,
      customerId: body.customerId,
      priority: body.priority,
      typeKey: body.typeKey,
      statusKey: body.statusKey,
    });
  }

  @Delete(":ticketId")
  @withUserAuthorized([UserRole.USER])
  async deleteTicket(@Param("ticketId") ticketId: string) {
    await this.deleteTicketService.deleteTicketOrFail(ticketId);
  }

  @Post(":ticketId/upload")
  @withUserAuthorized([UserRole.USER])
  async uploadTicketFile(@Param("ticketId") ticketId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const { file } = await this.uploadTicketFilesService.uploadTicketFileOrFail(ticketId, req.files.file);
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete(":ticketId/delete-file/:fileId")
  @withUserAuthorized([UserRole.USER])
  async deleteTicketFile(@Param("ticketId") ticketId: string, @Param("fileId") fileId: string) {
    await this.deleteTicketFilesService.deleteTicketFileOrFail(ticketId, fileId);
  }

  @Post("reorder")
  @withUserAuthorized([UserRole.USER])
  async reorder(@Body() body: RequestReorderTicketDTO) {
    await this.reorderTicketsService.reorderTicketsOrFail(body.statusKey, body.ticketIds, {
      emitTicketUpdatedEvent: true,
    });
  }
}
