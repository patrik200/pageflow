import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { CreateCorrespondenceGroupService } from "../services/groups/create";
import { CreateCorrespondencesService } from "../services/correspondences/create";
import { MoveCorrespondenceGroupService } from "../services/groups/move";
import { MoveCorrespondenceService } from "../services/correspondences/move";
import { EditCorrespondencesService } from "../services/correspondences/edit";
import { ArchiveCorrespondencesService } from "../services/correspondences/archive";
import { ActiveCorrespondencesService } from "../services/correspondences/active";
import { DeleteCorrespondenceService } from "../services/correspondences/delete";
import { DeleteCorrespondenceGroupService } from "../services/groups/delete";
import { GetCorrespondenceAndGroupService } from "../services/get";
import { EditCorrespondenceGroupService } from "../services/groups/edit";
import { GetCorrespondenceService } from "../services/correspondences/get";

import { RequestCreateCorrespondenceDTO } from "../dto/edit/CreateCorrespondence";
import { RequestCreateCorrespondenceGroupDTO } from "../dto/edit/CreateCorrespondenceGroup";
import { RequestUpdateCorrespondenceDTO } from "../dto/edit/UpdateCorrespondence";
import { RequestUpdateCorrespondenceGroupDTO } from "../dto/edit/UpdateCorrespondenceGroup";
import { ResponseCorrespondenceDTO } from "../dto/get/Correspondence";
import { RequestGetCorrespondenceGroupsAndCorrespondencesDTO } from "../dto/get/GetCorrespondenceGroupsAndCorrespondences";
import { ResponseCorrespondenceGroupsAndCorrespondencesDTO } from "../dto/get/CorrespondenceGroupsAndCorrespondences";

@Controller("correspondences")
export class CorrespondencesController {
  constructor(
    private createGroupService: CreateCorrespondenceGroupService,
    private createCorrespondencesService: CreateCorrespondencesService,
    private moveGroupService: MoveCorrespondenceGroupService,
    private moveCorrespondenceService: MoveCorrespondenceService,
    private editCorrespondencesService: EditCorrespondencesService,
    private archiveCorrespondencesService: ArchiveCorrespondencesService,
    private activeCorrespondencesService: ActiveCorrespondencesService,
    private deleteCorrespondenceService: DeleteCorrespondenceService,
    private deleteGroupService: DeleteCorrespondenceGroupService,
    private getCorrespondenceAndGroupService: GetCorrespondenceAndGroupService,
    private editGroupService: EditCorrespondenceGroupService,
    private getCorrespondencesService: GetCorrespondenceService,
  ) {}

  @Post("correspondence-group")
  @withUserAuthorized([UserRole.USER])
  async createCorrespondenceGroup(@Body() body: RequestCreateCorrespondenceGroupDTO) {
    const identifierOptions = this.getIdentifierForCreate(body);

    const id = await this.createGroupService.createGroupOrFail(identifierOptions, {
      name: body.name,
      description: body.description,
      isPrivate: body.isPrivate,
    });

    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Post("correspondence")
  @withUserAuthorized([UserRole.USER])
  async createCorrespondence(@Body() body: RequestCreateCorrespondenceDTO) {
    const identifierOptions = this.getIdentifierForCreate(body);

    const id = await this.createCorrespondencesService.createCorrespondenceOrFail(identifierOptions, {
      name: body.name,
      description: body.description,
      contractorId: body.contractorId,
      isPrivate: body.isPrivate,
      attributes: body.attributes,
    });

    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Post("correspondence-group/:sourceGroupId/move/:targetGroupId?")
  @withUserAuthorized([UserRole.USER])
  async moveCorrespondenceGroup(
    @Param("sourceGroupId") sourceGroupId: string,
    @Param("targetGroupId") targetGroupId?: string,
  ) {
    await this.moveGroupService.moveGroupOrFail({
      movableGroupId: sourceGroupId,
      toGroupId: targetGroupId,
    });
  }

  @Post("correspondence/:sourceCorrespondenceId/move/:targetGroupId?")
  @withUserAuthorized([UserRole.USER])
  async moveCorrespondence(
    @Param("sourceCorrespondenceId") sourceCorrespondenceId: string,
    @Param("targetGroupId") targetGroupId?: string,
  ) {
    await this.moveCorrespondenceService.moveCorrespondenceOrFail({
      movableCorrespondenceId: sourceCorrespondenceId,
      toGroupId: targetGroupId,
    });
  }

  @Patch("correspondence-group/:groupId")
  @withUserAuthorized([UserRole.USER])
  async updateCorrespondenceGroup(
    @Param("groupId") groupId: string,
    @Body() body: RequestUpdateCorrespondenceGroupDTO,
  ) {
    await this.editGroupService.updateGroupOrFail(groupId, body);
  }

  @Patch("correspondence/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async updateCorrespondence(
    @Param("correspondenceId") correspondenceId: string,
    @Body() body: RequestUpdateCorrespondenceDTO,
  ) {
    await this.editCorrespondencesService.updateCorrespondenceOrFail(correspondenceId, body);
  }

  @Post("correspondence/:correspondenceId/archive")
  @withUserAuthorized([UserRole.USER])
  async archiveRevision(@Param("correspondenceId") correspondenceId: string) {
    await this.archiveCorrespondencesService.archiveCorrespondenceOrFail(correspondenceId);
  }

  @Post("correspondence/:correspondenceId/active")
  @withUserAuthorized([UserRole.USER])
  async activeRevision(@Param("correspondenceId") correspondenceId: string) {
    await this.activeCorrespondencesService.activeCorrespondenceOrFail(correspondenceId);
  }

  @Delete("correspondence-group/:groupId")
  @withUserAuthorized([UserRole.USER])
  async deleteCorrespondenceGroup(@Param("groupId") groupId: string) {
    await this.deleteGroupService.deleteGroupOrFail(groupId);
  }

  @Delete("correspondence/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async deleteClientCorrespondence(@Param("correspondenceId") correspondenceId: string) {
    await this.deleteCorrespondenceService.deleteCorrespondenceOrFail(correspondenceId);
  }

  @Post()
  @withUserAuthorized([UserRole.USER], { processAsGet: true })
  async getCorrespondenceGroupsAndCorrespondences(@Body() body: RequestGetCorrespondenceGroupsAndCorrespondencesDTO) {
    const identifierOptions = this.getIdentifierForSearch(body);

    const correspondence = await this.getCorrespondenceAndGroupService.getCorrespondencesAndGroups(
      identifierOptions,
      {
        search: body.search,
        searchInRevisionAttachments: body.searchInRevisionAttachments,
        showArchived: body.showArchived,
        sorting: body.sorting,
        attributes: body.attributes,
        author: body.author,
      },
      {
        loadFavourites: true,
        loadPermissions: true,
        permissionSelectOptions: {
          loadUser: true,
          loadUserAvatar: true,
        },
        correspondenceSelectOptions: {
          loadAuthor: true,
          loadAuthorAvatar: true,
        },
        groupSelectOptions: {
          loadAuthor: true,
          loadAuthorAvatar: true,
        },
      },
    );

    return new ControllerResponse(ResponseCorrespondenceGroupsAndCorrespondencesDTO, correspondence);
  }

  @Get("correspondence/:correspondenceId")
  @withUserAuthorized([UserRole.USER])
  async getCorrespondenceDetail(@Param("correspondenceId") correspondenceId: string) {
    const correspondence = await this.getCorrespondencesService.getCorrespondenceOrFail(correspondenceId, {
      loadFavourites: true,
      loadPermissions: true,
      permissionSelectOptions: {
        loadUser: true,
        loadUserAvatar: true,
      },
      loadAuthorAvatar: true,
      loadContractor: true,
      loadContractorLogo: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
      loadRootGroupParentDocument: true,
      loadParentGroup: true,
      loadAttributes: true,
    });

    return new ControllerResponse(ResponseCorrespondenceDTO, correspondence);
  }

  private getIdentifierForCreate(body: RequestCreateCorrespondenceGroupDTO | RequestCreateCorrespondenceDTO) {
    if (body.parentGroupId) return { parentGroupId: body.parentGroupId };
    if (body.projectId) return { projectId: body.projectId };
    if (body.documentId) return { documentId: body.documentId };
    return {};
  }

  private getIdentifierForSearch(query: RequestGetCorrespondenceGroupsAndCorrespondencesDTO) {
    if (query.parentGroupId) return { parentGroupId: query.parentGroupId };
    if (query.projectId) return { projectId: query.projectId };
    if (query.documentId) return { documentId: query.documentId };
    return {};
  }
}
