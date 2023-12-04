import { Command } from "commander";
import * as process from "process";

import { addAllCommands } from "./commands/all";

export const program = new Command();

program.name("send").version("1.0.0").description("Утилита для выполнения команд на сервере.");

addAllCommands(program);

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
