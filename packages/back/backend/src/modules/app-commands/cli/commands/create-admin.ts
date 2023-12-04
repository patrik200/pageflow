import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addCreateAdminCommand = (program: Command) => {
  program
    .command("create-admin")
    .description("Создание администратора")
    .requiredOption("-c, --clientId <string>", "Client Id")
    .requiredOption("-e, --email <string>", "Email")
    .action((options: { clientId: string; email: string }) => {
      executeCommand("create-admin", options);
    });
};
