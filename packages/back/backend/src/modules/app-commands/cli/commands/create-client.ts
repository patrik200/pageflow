import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addCreateClientCommand = (program: Command) => {
  program
    .command("create-client")
    .description("Создание клиента")
    .requiredOption("-n, --name <string>", "Client name")
    .requiredOption("-d, --domain <string>", "Domain")
    .action((options: { name: string; domain: string }) => {
      executeCommand("create-client", options);
    });
};
