import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { UserRole } from "@app/shared-enums";

import { ClientEntity } from "entities/Client";

import { DeleteUserService } from "modules/users/services/user/delete";
import { GetUserListService } from "modules/users/services/user/get-list";
import { DeleteProjectService, GetProjectListService } from "modules/projects";
import { DeleteTicketBoardService, GetTicketBoardsListService } from "modules/ticket-boards";
import { DeleteCorrespondenceRootGroupService, GetCorrespondenceRootGroupService } from "modules/correspondences";
import { DeleteUserFlowService, GetUserFlowService } from "modules/userFlow";
import { DeleteSubscriptionService, GetSubscriptionService } from "modules/subscription";
import { DeletePaymentService, GetPaymentService } from "modules/payments";
import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";

import { GetClientService } from "./get";
import { DeleteClientLogoService } from "../logo/delete";

@Injectable()
export class DeleteClientService {
  constructor(
    @InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>,
    private deleteClientLogoService: DeleteClientLogoService,
    private getClientService: GetClientService,
    @Inject(forwardRef(() => DeleteProjectService)) private deleteProjectService: DeleteProjectService,
    @Inject(forwardRef(() => DeleteTicketBoardService)) private deleteTicketBoardService: DeleteTicketBoardService,
    @Inject(forwardRef(() => DeleteCorrespondenceRootGroupService))
    private deleteCorrespondenceRootGroupService: DeleteCorrespondenceRootGroupService,
    @Inject(forwardRef(() => DeleteUserService)) private deleteUserService: DeleteUserService,
    @Inject(forwardRef(() => DeleteSubscriptionService)) private deleteSubscriptionService: DeleteSubscriptionService,
    @Inject(forwardRef(() => DeleteUserFlowService)) private deleteUserFlowService: DeleteUserFlowService,
    @Inject(forwardRef(() => DeletePaymentService)) private deletePaymentService: DeletePaymentService,
    @Inject(forwardRef(() => GetProjectListService)) private getProjectListService: GetProjectListService,
    @Inject(forwardRef(() => GetCorrespondenceRootGroupService))
    private getCorrespondenceRootGroupService: GetCorrespondenceRootGroupService,
    @Inject(forwardRef(() => GetUserFlowService)) private getUserFlowService: GetUserFlowService,
    @Inject(forwardRef(() => GetTicketBoardsListService))
    private getTicketBoardsListService: GetTicketBoardsListService,
    @Inject(forwardRef(() => GetSubscriptionService)) private getSubscriptionService: GetSubscriptionService,
    @Inject(forwardRef(() => GetUserListService)) private getUserListService: GetUserListService,
    @Inject(forwardRef(() => GetPaymentService)) private getPaymentService: GetPaymentService,
  ) {}

  @Transactional()
  private async deleteProjects(client: ClientEntity) {
    const projects = await this.getProjectListService.dangerGetProjectsList({ where: { client: { id: client.id } } });
    for (const project of projects) {
      await this.deleteProjectService.deleteProjectOrFail(project.id, {
        checkPermissions: false,
        emitEvents: false,
        moveCorrespondencesToClient: false,
        moveDocuments: false,
      });
    }
  }

  @Transactional()
  private async deleteCorrespondences(client: ClientEntity) {
    const correspondenceRoot = await this.getCorrespondenceRootGroupService.dangerGetCorrespondenceRootGroupOrFail(
      client.id,
      {},
    );
    await this.deleteCorrespondenceRootGroupService.deleteGroupOrFail(correspondenceRoot.id);
  }

  @Transactional()
  private async deleteUserFlows(client: ClientEntity) {
    const userFlows = await this.getUserFlowService.dangerGetUserFlowsList({ where: { client: { id: client.id } } });
    for (const userFlow of userFlows) {
      await this.deleteUserFlowService.deleteUserFlowOrFail(userFlow.id, { checkPermissions: false });
    }
  }

  @Transactional()
  private async deleteTicketBoards(client: ClientEntity) {
    const ticketBoards = await this.getTicketBoardsListService.dangerGetTicketBoardsListByQuery(
      { projectId: null },
      { where: { client: { id: client.id } } },
    );
    for (const ticketBoard of ticketBoards) {
      await this.deleteTicketBoardService.deleteTicketBoardOrFail(ticketBoard.id, {
        checkPermissions: false,
        emitEvents: false,
      });
    }
  }

  @Transactional()
  private async deletePayments(client: ClientEntity) {
    const payments = await this.getPaymentService.dangerGetPaymentsList({ where: { client: { id: client.id } } });
    for (const payment of payments) {
      await this.deletePaymentService.dangerDeletePaymentOrFail(payment.id);
    }
  }

  @Transactional()
  private async deleteSubscription(client: ClientEntity) {
    const subscription = await this.getSubscriptionService.dangerGetSubscriptionByClientIdOrFail(client.id);
    await this.deleteSubscriptionService.dangerDeleteSubscriptionOrFail(subscription.id);
  }

  @Transactional()
  private async deleteUsers(client: ClientEntity) {
    const users = await this.getUserListService.dangerGetUsersList({
      where: { client: { id: client.id } },
      withDeleted: true,
    });

    for (const user of users) {
      await this.deleteUserService.deleteUserOrFail(user.id, {
        checkPermissions: false,
        softDelete: false,
      });
    }
  }

  @Transactional()
  private async deleteClientLogo(client: ClientEntity) {
    await this.deleteClientLogoService.dangerDeleteClientLogoOrFail(client.id);
  }

  @Transactional()
  private async deleteClient(client: ClientEntity) {
    await this.clientsRepository.delete(client.id);
  }

  @Transactional()
  async dangerDeleteClientOrFail(clientId: string) {
    const client = await this.getClientService.dangerGetClientByIdOrFail(clientId);
    await currentUserStorage.run(
      { ...emptyCurrentUserStorageValue, clientId: client.id, role: UserRole.ADMIN },
      async () => {
        await this.deleteProjects(client);
        await this.deleteCorrespondences(client);
        await this.deleteUserFlows(client);
        await this.deleteTicketBoards(client);
        await this.deletePayments(client);
        await this.deleteSubscription(client);
        await this.deleteUsers(client);
        await this.deleteClientLogo(client);
        await this.deleteClient(client);
      },
    );
  }
}
