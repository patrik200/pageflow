import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addPingCommand = (program: Command) => {
  program
    .command("ping")
    .description("Проверки целостности и качества соединений")
    .action(() => {
      executeCommand("ping", {});
    });
};
