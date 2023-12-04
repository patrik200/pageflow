import { config } from "@app/core-config";
import socketIoClient from "socket.io-client";

export const executeCommand = function (command: string, message: Record<string, string | number>, log = true) {
  return new Promise<string[]>((resolve, reject) => {
    const socket = socketIoClient(`http://localhost:${config.wsServer}/app-commands`);

    socket.on("connect", () => {
      if (log) console.log("Соединение установлено.");
      socket.emit(command, message);
    });

    const messages: string[] = [];

    socket.on("server_message", (message: string[]) => {
      messages.push(...message);
      if (log) console.log(...message);
    });

    socket.on("connect_error", () => {
      if (log) console.log("Ошибка соединения.");
      reject();
      socket.close();
    });

    socket.on("disconnect", () => {
      if (log) console.log("Соединение разорвано.");
      resolve(messages);
      socket.close();
    });
  });
};
