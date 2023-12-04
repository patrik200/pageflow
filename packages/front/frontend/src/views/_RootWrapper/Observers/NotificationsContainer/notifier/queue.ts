import uuid from "uuidjs";
import { ToastOptions } from "react-toastify";

import { NotificationEventInterface, notify } from "./notify";

export function notifyQueue(
  event: NotificationEventInterface,
  showNotification: (message: string, options?: ToastOptions) => void,
) {
  const id = uuid.generate();
  const storage = new LocalStorageQueue("notifications");
  storage.add(id, event);

  setTimeout(() => {
    notify(id, event, showNotification);
    storage.delete(id);
  }, 300);
}

class LocalStorageQueue {
  constructor(private field: string) {}

  private getKey(key: string) {
    return this.field + "_" + key;
  }

  add(key: string, value: Object) {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  delete(key: string) {
    localStorage.removeItem(this.getKey(key));
  }

  get(key: string) {
    return JSON.parse(localStorage.getItem(this.getKey(key))!);
  }

  keys() {
    return Object.keys(localStorage).filter((key) => key.startsWith(this.getKey("")));
  }
}

if (typeof window !== "undefined") {
  const storage = new LocalStorageQueue("notifications");
  storage.keys().forEach(() => {
    //TODO: возможно понадобится делать нотификации после смены страницы
    // notify(key, storage.get(key), showNotification);
  });
}
