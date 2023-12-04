import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addElasticSearchCommands = (program: Command) => {
  program
    .command("elastic [command]")
    .description("Команды elasticsearch")
    .requiredOption("-c, --clientId <string>", "Client Id")
    .action((command: string, options: { clientId: string }) => {
      if (command === "recreate-indexes") {
        executeCommand("elastic-recreate-indexes", options);
        return;
      }

      throw new Error("unknown command!");
    });
};
