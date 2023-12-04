import { Command } from "commander";

import { addCreateAdminCommand } from "./create-admin";
import { addCreateClientCommand } from "./create-client";
import { addElasticSearchCommands } from "./elastic";
import { addPingCommand } from "./ping";
import { addCreateUserCommand } from "./create-user";
import { addClientReadOnlyCommand } from "./read-only";

export const addAllCommands = (program: Command) => {
  addCreateAdminCommand(program);
  addCreateUserCommand(program);
  addCreateClientCommand(program);
  addClientReadOnlyCommand(program);
  addElasticSearchCommands(program);
  addPingCommand(program);
};
