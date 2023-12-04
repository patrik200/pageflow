import { EventEmitter } from "@worksolutions/utils";
import { SimpleEventEmitter } from "@app/kit";

import { NotificationEventInterface } from "../views/_RootWrapper/Observers/NotificationsContainer/notifier/notify";

export const globalEventBus = new EventEmitter<{
  FORCE_REFRESH_TOKEN: () => void;
  NOTIFICATION_SUCCESS: NotificationEventInterface;
  NOTIFICATION_ERROR: NotificationEventInterface;
  NOTIFICATION_WARNING: NotificationEventInterface;
  ADD_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT: HTMLElement;
  REMOVE_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT: HTMLElement;
}>(SimpleEventEmitter);
