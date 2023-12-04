import { Command } from "commander";

import { executeCommand } from "../execute-command";

export const addClientReadOnlyCommand = (program: Command) => {
  program
    .command("client-readonly")
    .description("Включение/Отключение режима только для чтения")
    .argument("<readOnly>", "Read only mode: 'enable-readonly', 'disable-readonly'")
    .action((readOnly: string) => {
      executeCommand("client-readonly", { mode: readOnly });
    });
};
