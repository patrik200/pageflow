import { typeormAlias, ElasticService, SentryTextService } from "@app/back-kit";
import { Inject, forwardRef, LoggerService } from "@nestjs/common";
import { isString } from "@worksolutions/utils";

import { getCurrentUser } from "modules/auth";
import {
  GetCorrespondenceRevisionsListService,
  CreateCorrespondenceRevisionsElasticService,
  InitElasticCorrespondenceRevisionService,
} from "modules/correspondence-revisions";
import {
  CreateCorrespondenceElasticService,
  GetCorrespondencesListService,
  GetCorrespondenceGroupsListService,
  CreateCorrespondenceGroupElasticService,
  InitElasticCorrespondenceAndGroupService,
} from "modules/correspondences";
import {
  InitElasticDocumentRevisionsService,
  GetDocumentRevisionsListService,
  CreateDocumentRevisionsElasticService,
} from "modules/document-revisions";
import {
  GetDocumentsListService,
  GetDocumentGroupsListService,
  InitElasticDocumentGroupsAndDocumentsService,
  CreateDocumentGroupsElasticService,
  CreateDocumentsElasticService,
} from "modules/documents";
import { GetProjectListService, CreateProjectElasticService, InitElasticProjectsService } from "modules/projects";
import { GetTicketsListService } from "modules/tickets";
import { InitElasticTicketService } from "modules/tickets/services/init";
import { CreateTicketElasticService } from "modules/tickets/services/tickets/create-elastic";
import { GetUserListService, CreateUserElasticService, InitElasticUserService } from "modules/users";

export class ElasticRecreateIndexesService {
  constructor(
    private sentryTextService: SentryTextService,
    //
    @Inject(forwardRef(() => InitElasticProjectsService))
    private initElasticProjectsService: InitElasticProjectsService,
    @Inject(forwardRef(() => CreateProjectElasticService))
    private createProjectElasticService: CreateProjectElasticService,
    @Inject(forwardRef(() => GetProjectListService))
    private getProjectListService: GetProjectListService,
    //
    @Inject(forwardRef(() => InitElasticDocumentGroupsAndDocumentsService))
    private initElasticDocumentGroupsAndDocumentsService: InitElasticDocumentGroupsAndDocumentsService,
    @Inject(forwardRef(() => GetDocumentGroupsListService))
    private getDocumentGroupsListService: GetDocumentGroupsListService,
    @Inject(forwardRef(() => CreateDocumentGroupsElasticService))
    private createDocumentGroupsElasticService: CreateDocumentGroupsElasticService,
    @Inject(forwardRef(() => GetDocumentsListService))
    private getDocumentsService: GetDocumentsListService,
    @Inject(forwardRef(() => CreateDocumentsElasticService))
    private createDocumentsElasticService: CreateDocumentsElasticService,
    //
    @Inject(forwardRef(() => InitElasticCorrespondenceAndGroupService))
    private initElasticCorrespondenceAndGroupService: InitElasticCorrespondenceAndGroupService,
    @Inject(forwardRef(() => GetCorrespondenceGroupsListService))
    private getCorrespondenceGroupsListService: GetCorrespondenceGroupsListService,
    @Inject(forwardRef(() => CreateCorrespondenceGroupElasticService))
    private createCorrespondenceGroupElasticService: CreateCorrespondenceGroupElasticService,
    @Inject(forwardRef(() => GetCorrespondencesListService))
    private getCorrespondencesListService: GetCorrespondencesListService,
    @Inject(forwardRef(() => CreateCorrespondenceElasticService))
    private createCorrespondenceElasticService: CreateCorrespondenceElasticService,
    //
    @Inject(forwardRef(() => InitElasticDocumentRevisionsService))
    private initElasticDocumentRevisionsService: InitElasticDocumentRevisionsService,
    @Inject(forwardRef(() => GetDocumentRevisionsListService))
    private getDocumentRevisionsListService: GetDocumentRevisionsListService,
    @Inject(forwardRef(() => CreateDocumentRevisionsElasticService))
    private createDocumentRevisionsElasticService: CreateDocumentRevisionsElasticService,
    //
    @Inject(forwardRef(() => InitElasticCorrespondenceRevisionService))
    private initElasticCorrespondenceRevisionService: InitElasticCorrespondenceRevisionService,
    @Inject(forwardRef(() => GetCorrespondenceRevisionsListService))
    private getCorrespondenceRevisionsListService: GetCorrespondenceRevisionsListService,
    @Inject(forwardRef(() => CreateCorrespondenceRevisionsElasticService))
    private createCorrespondenceRevisionsElasticService: CreateCorrespondenceRevisionsElasticService,
    //
    @Inject(forwardRef(() => InitElasticTicketService))
    private initElasticTicketService: InitElasticTicketService,
    @Inject(forwardRef(() => GetTicketsListService))
    private getTicketListService: GetTicketsListService,
    @Inject(forwardRef(() => CreateTicketElasticService))
    private createTicketElasticService: CreateTicketElasticService,
    //
    @Inject(forwardRef(() => InitElasticUserService))
    private initElasticUserService: InitElasticUserService,
    @Inject(forwardRef(() => GetUserListService))
    private getUserListService: GetUserListService,
    @Inject(forwardRef(() => CreateUserElasticService))
    private createUserElasticService: CreateUserElasticService,
    //
    @Inject(forwardRef(() => ElasticService))
    private elasticService: ElasticService,
  ) {}

  private async deleteAllIndexes(clientId: string, logger: LoggerService = console) {
    await this.elasticService.deleteAllIndexesOrFail({ clientId });
    logger.log("Success", "All indexes deleted");
  }

  private async recreateProjectIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticProjectsService.createIndex();
    if (isString(index)) {
      logger.error(index, "Recreate project indexes");
      return;
    }

    const mapping = await this.initElasticProjectsService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate project mapping");
      mapping.logBeautifulError();
      return;
    }

    const allProjects = await this.getProjectListService.dangerGetProjectsList({
      where: { client: { id: clientId } },
      select: ["id"],
    });

    for (let i = 0; i < allProjects.length; i++) {
      await this.createProjectElasticService.elasticCreateProjectIndexOrFail(allProjects[i].id, false);
      logger.log("Complete project " + (i + 1) + " of " + allProjects.length, "Recreate project indexes");
    }

    logger.log("Success", "Recreate project indexes");
  }

  private async recreateDocumentIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticDocumentGroupsAndDocumentsService.createIndex();

    if (isString(index)) {
      logger.error(index, "Recreate document indexes");
      return;
    }

    const mapping = await this.initElasticDocumentGroupsAndDocumentsService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate document mapping");
      mapping.logBeautifulError();
      return;
    }

    const allGroups = await this.getDocumentGroupsListService.dangerGetGroupsOrFail({
      where: { client: { id: clientId } },
      select: ["id"],
    });

    for (let i = 0; i < allGroups.length; i++) {
      await this.createDocumentGroupsElasticService.elasticCreateGroupIndexOrFail(allGroups[i].id, false);
      logger.log("Complete document group " + (i + 1) + " of " + allGroups.length, "Recreate document indexes");
    }

    const allDocuments = await this.getDocumentsService.dangerGetDocuments({
      where: { client: { id: clientId } },
      select: ["id"],
    });

    for (let i = 0; i < allDocuments.length; i++) {
      await this.createDocumentsElasticService.elasticCreateDocumentIndexOrFail(allDocuments[i].id, false);
      logger.log("Complete document " + (i + 1) + " of " + allDocuments.length, "Recreate document indexes");
    }

    logger.log("Success", "Recreate document indexes");
  }

  private async recreateCorrespondenceIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticCorrespondenceAndGroupService.createIndex();

    if (isString(index)) {
      logger.error(index, "Recreate correspondence indexes");
      return;
    }

    const mapping = await this.initElasticCorrespondenceAndGroupService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate correspondence mapping");
      mapping.logBeautifulError();
      return;
    }

    const allGroups = await this.getCorrespondenceGroupsListService.dangerGetGroupsList({
      where: { client: { id: clientId } },
      select: ["id"],
    });

    for (let i = 0; i < allGroups.length; i++) {
      await this.createCorrespondenceGroupElasticService.elasticCreateGroupIndexOrFail(allGroups[i].id, false);
      logger.log(
        "Complete correspondence group " + (i + 1) + " of " + allGroups.length,
        "Recreate correspondence indexes",
      );
    }

    const allCorrespondence = await this.getCorrespondencesListService.dangerGetCorrespondencesList({
      where: { client: { id: clientId } },
      select: ["id"],
    });

    for (let i = 0; i < allCorrespondence.length; i++) {
      await this.createCorrespondenceElasticService.elasticCreateCorrespondenceIndexOrFail(
        allCorrespondence[i].id,
        false,
      );
      logger.log(
        "Complete correspondence " + (i + 1) + " of " + allCorrespondence.length,
        "Recreate correspondence indexes",
      );
    }

    logger.log("Success", "Recreate correspondence indexes");
  }

  private async recreateDocumentRevisionsIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticDocumentRevisionsService.createIndex();
    if (isString(index)) {
      logger.error(index, "Recreate document revision indexes");
      return;
    }

    const mapping = await this.initElasticDocumentRevisionsService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate document revision mapping");
      mapping.logBeautifulError();
      return;
    }

    const allRevisions = await this.getDocumentRevisionsListService.dangerGetRevisionsList({
      where: { document: { client: { id: clientId } } },
      select: ["id"],
      join: { alias: typeormAlias, innerJoin: { document: typeormAlias + ".document" } },
    });

    for (let i = 0; i < allRevisions.length; i++) {
      await this.createDocumentRevisionsElasticService.elasticCreateRevisionIndexOrFail(allRevisions[i].id, false);
      logger.log(
        "Complete document revision " + (i + 1) + " of " + allRevisions.length,
        "Recreate document revision indexes",
      );
    }

    logger.log("Success", "Recreate document revision indexes");
  }

  private async recreateCorrespondenceRevisionsIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticCorrespondenceRevisionService.createIndex();
    if (isString(index)) {
      logger.error(index, "Recreate correspondence revision indexes");
      return;
    }

    const mapping = await this.initElasticCorrespondenceRevisionService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate correspondence revision mapping");
      mapping.logBeautifulError();
      return;
    }

    const allRevisions = await this.getCorrespondenceRevisionsListService.dangerGetRevisionsList({
      where: { correspondence: { client: { id: clientId } } },
      select: ["id"],
      join: {
        alias: typeormAlias,
        innerJoin: { correspondence: typeormAlias + ".correspondence" },
      },
    });

    for (let i = 0; i < allRevisions.length; i++) {
      await this.createCorrespondenceRevisionsElasticService.elasticCreateCorrespondenceRevisionIndexOrFail(
        allRevisions[i].id,
        false,
      );
      logger.log(
        "Complete correspondence revision " + (i + 1) + " of " + allRevisions.length,
        "Recreate correspondence revision indexes",
      );
    }

    logger.log("Success", "Recreate correspondence revision indexes");
  }

  private async recreateTicketIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticTicketService.createIndex();
    if (isString(index)) {
      logger.error(index, "Recreate ticket indexes");
      return;
    }

    const mapping = await this.initElasticTicketService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate ticket mapping");
      mapping.logBeautifulError();
      return;
    }

    const allTickets = await this.getTicketListService.dangerGetTicketsList({
      where: { client: { id: clientId } },
    });

    await Promise.all(
      allTickets.map(async (ticket, i) => {
        await this.createTicketElasticService.elasticCreateTicketIndexOrFail(ticket.id, false);
        logger.log("Complete ticket " + (i + 1) + " of " + allTickets.length, "Recreate ticket indexes");
      }),
    );

    logger.log("Success", "Recreate ticket indexes");
  }

  private async recreateUserIndexes(clientId: string, logger: LoggerService = console) {
    const index = await this.initElasticUserService.createIndex();
    if (isString(index)) {
      logger.error(index, "Recreate user indexes");
      return;
    }

    const mapping = await this.initElasticUserService.createMapping();
    if (mapping !== true) {
      logger.error(mapping.message, "Recreate user mapping");
      mapping.logBeautifulError();
      return;
    }

    const allUsers = await this.getUserListService.dangerGetUsersList({
      where: { client: { id: clientId } },
      select: ["id"],
      withDeleted: true,
    });

    for (let i = 0; i < allUsers.length; i++) {
      await this.createUserElasticService.createElasticIndexUserOrFail(allUsers[i].id, false);
      logger.log("Complete user " + (i + 1) + " of " + allUsers.length, "Recreate user indexes");
    }

    logger.log("Success", "Recreate user indexes");
  }

  async recreateCurrentClientIndexes() {
    await this.recreateIndexes(getCurrentUser().clientId);
  }

  async recreateIndexes(clientId: string, logger: LoggerService = console) {
    const label = `(client ${clientId})`;
    console.time(label);
    logger.log("Start recreating", label);
    try {
      await this.deleteAllIndexes(clientId, logger);
      await this.recreateCorrespondenceIndexes(clientId, logger);
      await this.recreateCorrespondenceRevisionsIndexes(clientId, logger);
      await this.recreateProjectIndexes(clientId, logger);
      await this.recreateDocumentIndexes(clientId, logger);
      await this.recreateDocumentRevisionsIndexes(clientId, logger);
      await this.recreateTicketIndexes(clientId, logger);
      await this.recreateUserIndexes(clientId, logger);
      logger.log("Success", label);
    } catch (e) {
      logger.error("Error", label);
      this.sentryTextService.error(e, {
        context: label,
        contextService: ElasticRecreateIndexesService.name,
      });
    } finally {
      console.timeEnd(label);
    }
  }
}
