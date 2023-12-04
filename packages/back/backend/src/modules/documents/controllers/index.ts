import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ControllerResponse, ServiceError } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { GetDocumentsAndGroupsService, GetSearchDocumentsAndGroupsIdentifier } from "../services/get";
import { GetDocumentService } from "../services/documents/get";
import { CreateDocumentGroupService } from "../services/groups/create";
import { CreateDocumentService } from "../services/documents/create";
import { DeleteDocumentGroupService } from "../services/groups/delete";
import { DeleteDocumentService } from "../services/documents/delete";
import { EditDocumentGroupService } from "../services/groups/edit";
import { EditDocumentService } from "../services/documents/edit";
import { ArchiveDocumentService } from "../services/documents/archive";
import { ActiveDocumentService } from "../services/documents/active";
import { MoveDocumentService } from "../services/documents/move";
import { MoveDocumentGroupService } from "../services/groups/move";

import { RequestGetDocumentGroupsAndDocumentsDTO } from "../dto/get/GetDocumentGroupsAndDocument";
import { ResponseDocumentGroupAndDocumentsDTO } from "../dto/get/DocumentGroupsAndDocuments";
import { ResponseDocumentDTO } from "../dto/get/Document";
import { RequestCreateDocumentGroupDTO } from "../dto/edit/CreateDocumentGroup";
import { RequestUpdateDocumentGroupDTO } from "../dto/edit/UpdateDocumentGroup";
import { RequestCreateDocumentDTO } from "../dto/edit/CreateDocument";
import { RequestUpdateDocumentDTO } from "../dto/edit/UpdateDocument";

@Controller("documents")
export class DocumentsController {
  constructor(
    private getDocumentsAndGroupsService: GetDocumentsAndGroupsService,
    private getDocumentService: GetDocumentService,
    private createDocumentGroupService: CreateDocumentGroupService,
    private createDocumentService: CreateDocumentService,
    private deleteDocumentGroupService: DeleteDocumentGroupService,
    private deleteDocumentService: DeleteDocumentService,
    private editDocumentGroupService: EditDocumentGroupService,
    private editDocumentService: EditDocumentService,
    private archiveDocumentService: ArchiveDocumentService,
    private activeDocumentService: ActiveDocumentService,
    private moveDocumentsService: MoveDocumentService,
    private moveDocumentsGroupService: MoveDocumentGroupService,
  ) {}

  private getIdentifierForSearch(
    query: RequestGetDocumentGroupsAndDocumentsDTO,
  ): GetSearchDocumentsAndGroupsIdentifier {
    if (query.parentGroupId) return { parentGroupId: query.parentGroupId };
    if (query.projectId) return { projectId: query.projectId };
    throw new Error("unknown state");
  }

  @Post()
  @withUserAuthorized([UserRole.USER], { processAsGet: true })
  async getDocumentGroupsAndDocuments(@Body() body: RequestGetDocumentGroupsAndDocumentsDTO) {
    const identifierOptions = this.getIdentifierForSearch(body);

    const results = await this.getDocumentsAndGroupsService.getDocumentsAndGroupsOrFail(
      identifierOptions,
      {
        search: body.search,
        searchInRevisionAttachments: body.searchInRevisionAttachments,
        lastRevisionStatus: body.lastRevisionStatus,
        showArchived: body.showArchived,
        typeKey: body.typeKey,
        sorting: body.sorting,
        attributes: body.attributes,
        author: body.author,
        responsibleUser: body.responsibleUser,
      },
      {
        loadFavourites: true,
        loadPermissions: true,
        permissionSelectOptions: {
          loadUser: true,
          loadUserAvatar: true,
        },
        documentSelectOptions: {
          loadAuthorAvatar: true,
        },
        groupSelectOptions: {
          loadAuthor: true,
          loadAuthorAvatar: true,
        },
      },
    );

    return new ControllerResponse(ResponseDocumentGroupAndDocumentsDTO, results);
  }

  @Get("document/:documentId")
  @withUserAuthorized([UserRole.USER])
  async getDocumentDetail(@Param("documentId") documentId: string) {
    const document = await this.getDocumentService.getDocumentOrFail(documentId, {
      loadFavourites: true,
      loadAuthorAvatar: true,
      loadResponsibleUser: true,
      loadResponsibleUserAvatar: true,
      loadResponsibleUserFlow: true,
      loadResponsibleUserFlowRows: true,
      loadResponsibleUserFlowRowsUsers: true,
      loadResponsibleUserFlowRowsUsersUser: true,
      loadResponsibleUserFlowRowsUsersUserAvatar: true,
      loadType: true,
      loadRootGroup: true,
      loadRootGroupParentProject: true,
      loadAttributes: true,
      loadPermissions: true,
      permissionSelectOptions: {
        loadUser: true,
        loadUserAvatar: true,
      },
    });

    return new ControllerResponse(ResponseDocumentDTO, document);
  }

  @Post("document-group")
  @withUserAuthorized([UserRole.USER])
  async createDocumentGroup(@Body() body: RequestCreateDocumentGroupDTO) {
    if (!body.parentGroupId && !body.projectId) {
      throw new ServiceError("payload", "Требуется parentGroupId или projectId");
    }

    const identifierOptions = body.parentGroupId
      ? { parentGroupId: body.parentGroupId }
      : { projectId: body.projectId as string };

    const id = await this.createDocumentGroupService.createGroupOrFail(identifierOptions, {
      name: body.name,
      description: body.description,
      isPrivate: body.isPrivate,
    });

    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Patch("document-group/:groupId")
  @withUserAuthorized([UserRole.USER])
  async updateDocumentGroup(@Param("groupId") groupId: string, @Body() body: RequestUpdateDocumentGroupDTO) {
    await this.editDocumentGroupService.updateGroupOrFail(groupId, {
      name: body.name,
      description: body.description,
      isPrivate: body.isPrivate,
    });
  }

  @Delete("document-group/:groupId")
  @withUserAuthorized([UserRole.USER])
  async deleteDocumentGroup(@Param("groupId") groupId: string) {
    await this.deleteDocumentGroupService.deleteGroupOrFail(groupId);
  }

  @Post("document")
  @withUserAuthorized([UserRole.USER])
  async createDocument(@Body() body: RequestCreateDocumentDTO) {
    if (!body.parentGroupId && !body.projectId) {
      throw new ServiceError("payload", "Требуется parentGroupId или projectId");
    }

    const identifierOptions = body.parentGroupId
      ? { parentGroupId: body.parentGroupId }
      : { projectId: body.projectId as string };

    const id = await this.createDocumentService.createDocumentOrFail(identifierOptions, {
      name: body.name,
      description: body.description,
      remarks: body.remarks,
      responsibleUserId: body.responsibleUserId,
      responsibleUserFlowId: body.responsibleUserFlowId,
      typeKey: body.typeKey,
      contractorId: body.contractorId,
      startDatePlan: body.startDatePlan,
      startDateForecast: body.startDateForecast,
      startDateFact: body.startDateFact,
      endDatePlan: body.endDatePlan,
      endDateForecast: body.endDateForecast,
      endDateFact: body.endDateFact,
      isPrivate: body.isPrivate,
      attributes: body.attributes,
    });

    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Patch("document/:documentId")
  @withUserAuthorized([UserRole.USER])
  async updateDocument(@Param("documentId") documentId: string, @Body() body: RequestUpdateDocumentDTO) {
    await this.editDocumentService.updateDocumentOrFail(
      { documentId },
      {
        name: body.name,
        description: body.description,
        remarks: body.remarks,
        responsibleUserId: body.responsibleUserId,
        responsibleUserFlowId: body.responsibleUserFlowId,
        typeKey: body.typeKey,
        contractorId: body.contractorId,
        startDatePlan: body.startDatePlan,
        startDateForecast: body.startDateForecast,
        startDateFact: body.startDateFact,
        endDatePlan: body.endDatePlan,
        endDateForecast: body.endDateForecast,
        endDateFact: body.endDateFact,
        isPrivate: body.isPrivate,
        attributes: body.attributes,
      },
    );
  }

  @Delete("document/:documentId")
  @withUserAuthorized([UserRole.USER])
  async deleteDocument(@Param("documentId") documentId: string) {
    await this.deleteDocumentService.deleteDocumentOrFail(documentId);
  }

  @Post("document-group/:movableGroupId/move/:targetGroupId?")
  @withUserAuthorized([UserRole.USER])
  async moveDocumentGroup(
    @Param("movableGroupId") movableGroupId: string,
    @Param("targetGroupId") targetGroupId?: string,
  ) {
    await this.moveDocumentsGroupService.moveGroupOrFail({
      movableGroupId,
      toGroupId: targetGroupId,
    });
  }

  @Post("document/:movableDocumentId/move/:targetGroupId?")
  @withUserAuthorized([UserRole.USER])
  async moveDocument(
    @Param("movableDocumentId") movableDocumentId: string,
    @Param("targetGroupId") targetGroupId?: string,
  ) {
    await this.moveDocumentsService.moveDocumentOrFail({
      movableDocumentId,
      toGroupId: targetGroupId,
    });
  }

  @Post("document/:documentId/archive")
  @withUserAuthorized([UserRole.USER])
  async archiveDocument(@Param("documentId") documentId: string) {
    await this.archiveDocumentService.archiveDocumentOrFail(documentId);
  }

  @Post("document/:documentId/active")
  @withUserAuthorized([UserRole.USER])
  async activeDocument(@Param("documentId") documentId: string) {
    await this.activeDocumentService.activeDocumentOrFail(documentId);
  }
}
