import { Body, Controller, Delete, Get, Patch, Post, Query, Req } from "@nestjs/common";
import { ControllerResponse, ServiceError, StorageFileDTO } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteClientLogoService } from "../services/logo/delete";
import { EditClientLogoService } from "../services/logo/edit";
import { GetClientService } from "../services/client/get";
import { EditClientService } from "../services/client/edit";
import { GetClientNotificationsService } from "../services/client/notifications";

import { ResponseClientDTO } from "../dto/get/Client";
import { RequestUpdateClientDTO } from "../dto/edit/UpdateClient";
import { RequestTenantDTO } from "../dto/get/Tenant";
import { ResponseStorageUsageInfoDTO } from "../dto/get/Storage";
import { ResponseClientNotificationsListDTO } from "../dto/get/Notification";

@Controller("clients")
export class ClientsController {
  constructor(
    private getClientService: GetClientService,
    private editClientService: EditClientService,
    private editClientLogoService: EditClientLogoService,
    private deleteClientService: DeleteClientLogoService,
    private getClientNotificationsService: GetClientNotificationsService,
  ) {}

  @Get("current")
  @withUserAuthorized([UserRole.USER])
  async getCurrentClient() {
    const client = await this.getClientService.getCurrentClientOrFail({ loadLogo: true });
    return new ControllerResponse(ResponseClientDTO, client);
  }

  @Patch("current")
  @withUserAuthorized([])
  async updateCurrentClient(@Body() body: RequestUpdateClientDTO) {
    await this.editClientService.editClientOrFail({ name: body.name });
    const client = await this.getClientService.getCurrentClientOrFail({ loadLogo: true });
    return new ControllerResponse(ResponseClientDTO, client);
  }

  @Post("current/logo")
  @withUserAuthorized([])
  async updateCurrentClientLogo(@Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const file = await this.editClientLogoService.editClientLogoOrFail({ file: req.files.file });
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete("current/logo")
  @withUserAuthorized([])
  async deleteCurrentClientLogo() {
    await this.deleteClientService.deleteClientLogoOrFail();
  }

  @Get("tenant")
  async getTenant(@Query() body: RequestTenantDTO) {
    const client = await this.getClientService.getClientByDomainOrFail(body.domain, { loadLogo: true });
    return new ControllerResponse(ResponseClientDTO, client);
  }

  @Get("current/storage-info")
  @withUserAuthorized([])
  async getStorageUsageInfo() {
    const storageUsageInfo = await this.getClientService.getCurrentClientStorageUsageInfoOrFail();
    return new ControllerResponse(ResponseStorageUsageInfoDTO, storageUsageInfo);
  }

  @Get("notifications")
  @withUserAuthorized([UserRole.USER])
  async getNotifications() {
    const notifications = await this.getClientNotificationsService.getCurrentClientNotifications();
    return new ControllerResponse(ResponseClientNotificationsListDTO, { list: notifications });
  }
}
