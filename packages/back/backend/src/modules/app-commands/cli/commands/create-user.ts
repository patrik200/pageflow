import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addCreateUserCommand = (program: Command) => {
  program
    .command("create-user")
    .description("Создание пользователя")
    .requiredOption("-c, --clientId <string>", "Client Id")
    .requiredOption("-e, --email <string>", "Email")
    .action((options: { clientId: string; email: string }) => {
      executeCommand("create-user", options);
    });
};
