import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ControllerResponse, ServiceError } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { CreateContractorsService } from "../services/contractor/create";
import { EditContractorsService } from "../services/contractor/edit";
import { GetContractorsService } from "../services/contractor/get";
import { GetContractorsListService } from "../services/contractor/get-list";
import { EditContractorsLogoService } from "../services/logo/edit";

import { ResponseContractorDTO, ResponseContractorsListDTO } from "../dto/get/Contractor";
import { RequestCreateContractorDTO } from "../dto/edit/CreateContractor";
import { RequestUpdateContractorDTO } from "../dto/edit/UpdateContractor";

@Controller("contractors")
export class ContractorsController {
  constructor(
    private getContractorsService: GetContractorsService,
    private getContractorsListService: GetContractorsListService,
    private editContractorsService: EditContractorsService,
    private createContractorsService: CreateContractorsService,
    private editContractorsLogoService: EditContractorsLogoService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getContractors() {
    const contractors = await this.getContractorsListService.getContractorsListOrFail({ loadLogo: true });
    return new ControllerResponse(ResponseContractorsListDTO, { list: contractors });
  }

  @Post()
  @withUserAuthorized([UserRole.USER])
  async createContractor(@Body() body: RequestCreateContractorDTO) {
    const id = await this.createContractorsService.createContractorOrFail({
      name: body.name,
    });
    const contractor = await this.getContractorsService.getContractorOrFail(id, { loadLogo: true });
    return new ControllerResponse(ResponseContractorDTO, contractor);
  }

  @Patch(":contractorId")
  @withUserAuthorized([UserRole.USER])
  async updateContractor(@Param("contractorId") id: string, @Body() body: RequestUpdateContractorDTO) {
    await this.editContractorsService.editContractorOrFail(id, {
      name: body.name,
    });
    const contractor = await this.getContractorsService.getContractorOrFail(id, { loadLogo: true });
    return new ControllerResponse(ResponseContractorDTO, contractor);
  }

  @Post(":contractorId/logo")
  @withUserAuthorized([UserRole.USER])
  async updateContractorLogo(@Param("contractorId") id: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");

    await this.editContractorsLogoService.editContractorLogoOrFail(id, { file: req.files.file });
    const contractor = await this.getContractorsService.getContractorOrFail(id, { loadLogo: true });
    return new ControllerResponse(ResponseContractorDTO, contractor);
  }
}
