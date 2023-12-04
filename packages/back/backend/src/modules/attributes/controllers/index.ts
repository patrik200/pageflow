import { ControllerResponse } from "@app/back-kit";
import { AttributeCategory, UserRole } from "@app/shared-enums";
import { Controller, Get, Param, ParseEnumPipe, Query } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { GetAttributeTypesService } from "../services/get-keys";
import { GetAttributeValuesService } from "../services/get-values";

import {
  RequestGetAttributeValuesDTO,
  ResponseAttributeTypesDTO,
  ResponseAttributeValuesDTO,
} from "../dto/get/Attributes";

@Controller("attributes/:category")
export class AttributesController {
  constructor(
    private getAttributeTypesService: GetAttributeTypesService,
    private getAttributeValuesService: GetAttributeValuesService,
  ) {}

  @Get("types")
  @withUserAuthorized([UserRole.USER])
  async getAttributeTypes(@Param("category", new ParseEnumPipe(AttributeCategory)) category: AttributeCategory) {
    const types = await this.getAttributeTypesService.getAttributeTypesOrFail({ category });
    return new ControllerResponse(ResponseAttributeTypesDTO, { types });
  }

  @Get("values")
  @withUserAuthorized([UserRole.USER])
  async getAttributeValues(
    @Param("category", new ParseEnumPipe(AttributeCategory)) category: AttributeCategory,
    @Query() query: RequestGetAttributeValuesDTO,
  ) {
    const values = await this.getAttributeValuesService.getAttributeValuesOrFail({
      category,
      attributeTypeKey: query.attributeTypeKey,
    });

    return new ControllerResponse(ResponseAttributeValuesDTO, { values });
  }
}
