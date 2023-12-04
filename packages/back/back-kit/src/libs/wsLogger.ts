import { Socket } from "socket.io";
import { LoggerService } from "@nestjs/common";

export class WsLogger implements LoggerService {
  constructor(private client: Socket, private event: string) {}

  log(...data: any[]) {
    this.client.emit(this.event, data);
  }

  error(...data: any[]) {
    this.log(`ERROR: ${data}`);
  }

  warn(...data: any[]) {
    this.log(`WARN: ${data}`);
  }

  info(...data: any[]): void {
    this.log(`INFO: ${data}`);
  }
}
