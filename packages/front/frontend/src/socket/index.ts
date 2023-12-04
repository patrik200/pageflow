import { io, Socket } from "socket.io-client";
import type { Constructable } from "typedi";
import { AppRequestError, BaseEntity, makeTransformableObject } from "@app/kit";

export class AppSocket {
  private instance: Socket;

  private getUrl(path: string) {
    if (process.env.NODE_ENV === "development") return `http://localhost:8000${path}`;
    return path;
  }

  constructor(connectionUrl: string) {
    this.instance = io(this.getUrl("/root"), {
      autoConnect: false,
      withCredentials: true,
      query: { connectionUrl },
      transports: ["websocket"],
    });
  }

  connect = async () => {
    this.instance.connect();
    return new Promise<AppSocket>((resolve) => {
      this.instance.once("connect", () => resolve(this));
    });
  };

  auth = () => {
    this.sendEvent("auth", {});
    return new Promise<void>((resolve) => this.once("auth-complete", null, () => resolve()));
  };

  disconnect = () => {
    this.instance.disconnect();
    return this;
  };

  sendEvent = (eventName: string, payload: Record<string, any>) => {
    this.instance.emit(eventName, payload);
    return this;
  };

  private eventHandlerFabric<ENTITY extends BaseEntity>(
    Entity: Constructable<ENTITY> | null,
    callback: (error: null | AppRequestError, payload: ENTITY) => void,
  ) {
    return async function (data: ENTITY) {
      if (!Entity) {
        callback(null, data);
        return;
      }

      const instance = makeTransformableObject(Entity, (plainInstance) =>
        plainInstance.__schemaTransform ? plainInstance.__schemaTransform(data) : data,
      );

      const [validationError] = await instance.validateAsync({ stopAtFirstError: true });

      try {
        if (validationError) throw validationError;
        callback(null, instance);
      } catch (e) {
        const convertedError = new AppRequestError(
          { message: (e as Error).message, statusCode: -1, response: undefined },
          { error: e },
        );

        callback(convertedError, null!);
      }
    };
  }

  on = <ENTITY extends BaseEntity>(
    eventName: string,
    Entity: Constructable<ENTITY> | null,
    callback: (error: null | AppRequestError, payload: ENTITY) => void,
  ) => {
    const handler = this.eventHandlerFabric(Entity, callback);
    this.instance.on(eventName, handler);
    return () => void this.instance.off(eventName, handler);
  };

  once = <ENTITY extends BaseEntity>(
    eventName: string,
    Entity: Constructable<ENTITY> | null,
    callback: (error: null | AppRequestError, payload: ENTITY) => void,
  ) => {
    const handler = this.eventHandlerFabric(Entity, callback);
    this.instance.once(eventName, handler);
    return () => void this.instance.off(eventName, handler);
  };
}
