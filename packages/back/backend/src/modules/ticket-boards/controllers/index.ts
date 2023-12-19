import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { CreateTicketBoardService } from "../services/boards/create";
import { DeleteTicketBoardService } from "../services/boards/delete";
import { EditTicketBoardService } from "../services/boards/edit";
import { GetTicketBoardsListService } from "../services/boards/get-list";

import { RequestCreateTicketBoardDTO } from "../dto/edit/CreateTicketBoard";
import { RequestUpdateTicketBoardDTO } from "../dto/edit/UpdateTicketBoard";
import { RequestGetTicketBoardsDTO, ResponseTicketBoardsListDTO } from "../dto/get/TicketBoard";

@Controller("ticket-boards")
export class TicketBoardsController {
  constructor(
    private getTicketBoardsListService: GetTicketBoardsListService,
    private createTicketBoardService: CreateTicketBoardService,
    private deleteTicketBoardService: DeleteTicketBoardService,
    private editTicketBoardService: EditTicketBoardService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async ticketBoardsList(@Query() body: RequestGetTicketBoardsDTO) {
    const boards = await this.getTicketBoardsListService.getTicketBoardsList(
      {
        projectId: body.projectId ?? null,
      },
      {
        loadFavourites: true,
      },
    );

    return new ControllerResponse(ResponseTicketBoardsListDTO, { list: boards });
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createTicketBoard(@Body() body: RequestCreateTicketBoardDTO) {
    const boardId = await this.createTicketBoardService.createTicketBoardOrFail(
      body.projectId ? { projectId: body.projectId } : {},
      {
        name: body.name,
        slug: body.slug,
        isPrivate: body.isPrivate,
      },
    );

    return new ControllerResponse(ResponseIdDTO, { id: boardId });
  }

  @Patch(":boardId")
  @withUserAuthorized([UserRole.USER])
  async updateTicketBoard(@Param("boardId") boardId: string, @Body() body: RequestUpdateTicketBoardDTO) {
    await this.editTicketBoardService.updateTicketBoardOrFail(boardId, {
      name: body.name,
      isPrivate: body.isPrivate,
    });
  }

  @Delete(":boardId")
  @withUserAuthorized([UserRole.USER])
  async deleteTicketBoard(@Param("boardId") boardId: string) {
    await this.deleteTicketBoardService.deleteTicketBoardOrFail(boardId);
  }
}
