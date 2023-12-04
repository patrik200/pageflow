import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";
import { ControllerResponse } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";

import { CreateDictionaryValueService } from "../services/dictionary-value/create";
import { DeleteDictionaryValueService } from "../services/dictionary-value/delete";
import { EditDictionaryValueService } from "../services/dictionary-value/edit";
import { EditSortDictionaryValueService } from "../services/dictionary-value/edit-sort";
import { GetDictionaryListService } from "../services/dictionary/get-list";

import { RequestCreateDictionaryValueDTO } from "../dto/edit/CreateDictionaryValue";
import { RequestUpdateDictionaryValueDTO } from "../dto/edit/UpdateDictionaryValue";
import { ResponseDictionariesListDTO } from "../dto/get/Dictionary";
import { RequestUpdateDictionaryValuesSortDTO } from "../dto/edit/UpdateDictionaryValuesSort";

@Controller("dictionaries")
export class DictionaryController {
  constructor(
    private getDictionaryListService: GetDictionaryListService,
    private createDictionaryValueService: CreateDictionaryValueService,
    private editDictionaryValueService: EditDictionaryValueService,
    private deleteDictionaryValueService: DeleteDictionaryValueService,
    private editSortDictionaryValueService: EditSortDictionaryValueService,
  ) {}

  @Get()
  @withUserAuthorized([UserRole.USER])
  async getDictionaries() {
    const dictionaries = await this.getDictionaryListService.getDictionariesListOrFail({ loadValues: true });
    return new ControllerResponse(ResponseDictionariesListDTO, { list: dictionaries });
  }

  @Post(":dictionaryId/values")
  @withUserAuthorized([])
  async createDictionaryValue(
    @Param("dictionaryId") dictionaryId: string,
    @Body() body: RequestCreateDictionaryValueDTO,
  ) {
    await this.createDictionaryValueService.createDictionaryValueOrFail(dictionaryId, {
      key: body.key,
      value: body.value,
      canDelete: true,
    });
  }

  @Patch(":dictionaryId/values/:key")
  @HttpCode(HttpStatus.NO_CONTENT)
  @withUserAuthorized([])
  async updateDictionaryValue(
    @Param("dictionaryId") dictionaryId: string,
    @Param("key") key: string,
    @Body() body: RequestUpdateDictionaryValueDTO,
  ) {
    await this.editDictionaryValueService.updateDictionaryValueOrFail(dictionaryId, key, {
      value: body.value,
    });
  }

  @Delete(":dictionaryId/values/:dictionaryValueKey/:dictionaryValueReplaceKey?")
  @HttpCode(HttpStatus.NO_CONTENT)
  @withUserAuthorized([UserRole.USER])
  async deleteDictionaryValue(
    @Param("dictionaryId") dictionaryId: string,
    @Param("dictionaryValueKey") dictionaryValueKey: string,
    @Param("dictionaryValueReplaceKey") dictionaryValueReplaceKey?: string,
  ) {
    await this.deleteDictionaryValueService.deleteDictionaryValueOrFail(dictionaryId, dictionaryValueKey, {
      dictionaryValueReplaceKey,
    });
  }

  @Post(":dictionary/values/sort")
  @HttpCode(HttpStatus.NO_CONTENT)
  @withUserAuthorized([])
  async updateDictionaryValueSort(
    @Param("dictionary") dictionaryId: string,
    @Body() body: RequestUpdateDictionaryValuesSortDTO,
  ) {
    await this.editSortDictionaryValueService.updateDictionaryValueSortOrFail(dictionaryId, body.keys);
  }
}
