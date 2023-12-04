import { WsLogger } from "@app/back-kit";
import { config } from "@app/core-config";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { ElasticRecreateIndexesService } from "modules/elastic";

import { AddFixtureToClientCommand } from "../service/add-fixture-to-client";
import { CreateAdminCommand } from "../service/create-admin";
import { CreateClientCommand } from "../service/create-client";
import { CreateUserCommand } from "../service/create-user";
import { ReadOnlyModeCommand } from "../service/read-only-mode";

@WebSocketGateway(config.wsServer, { namespace: "app-commands" })
export class AppCommandWebSocketGateway {
  public static readonly serverMessage = "server_message";

  constructor(
    private elasticRecreateIndexesService: ElasticRecreateIndexesService,
    private addFixtureToClientCommand: AddFixtureToClientCommand,
    private createAdminCommand: CreateAdminCommand,
    private createUserCommand: CreateUserCommand,
    private createClientCommand: CreateClientCommand,
    private readOnlyModeCommand: ReadOnlyModeCommand,
  ) {}

  @SubscribeMessage("elastic-recreate-indexes")
  async recreateIndexes(@MessageBody() data: { clientId: string }, @ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.elasticRecreateIndexesService.recreateIndexes(data.clientId, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("fixtures-add-dictionary-to-client")
  async fixturesAddDictionaryToClient(
    @MessageBody() data: { clientId: string; dictionaryType: string },
    @ConnectedSocket() client: Socket,
  ) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.addFixtureToClientCommand.addDictionaryToClient(data.clientId, data.dictionaryType, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("create-admin")
  async createAdmin(@MessageBody() data: { clientId: string; email: string }, @ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.createAdminCommand.run(data.clientId, data.email, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("create-user")
  async createUser(@MessageBody() data: { clientId: string; email: string }, @ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.createUserCommand.run(data.clientId, data.email, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("create-client")
  async createClient(@MessageBody() data: { name: string; domain: string }, @ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.createClientCommand.run(data, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("client-readonly")
  async clientReadOnly(@MessageBody() data: { mode: string }, @ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    await this.readOnlyModeCommand.run(data.mode, wsLogger);
    client.disconnect();
  }

  @SubscribeMessage("ping")
  async ping(@ConnectedSocket() client: Socket) {
    const wsLogger = new WsLogger(client, AppCommandWebSocketGateway.serverMessage);
    wsLogger.log("pong!!!");
    client.disconnect();
  }
}
