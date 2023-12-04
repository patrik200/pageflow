import React from "react";
import { ToastContainer } from "react-toastify";
import { useEventEmitter } from "@worksolutions/react-utils";
import "react-toastify/dist/ReactToastify.css";

import { globalEventBus } from "core/eventBus";

import { showError, showSuccess, showWarn } from "./toasts";
import { NotificationEventInterface } from "./notifier/notify";
import { notifyQueue } from "./notifier/queue";

function NotificationsContainer() {
  useEventEmitter(
    globalEventBus,
    "NOTIFICATION_SUCCESS",
    React.useCallback((event: NotificationEventInterface) => notifyQueue(event, showSuccess), []),
  );

  useEventEmitter(
    globalEventBus,
    "NOTIFICATION_ERROR",
    React.useCallback((event: NotificationEventInterface) => notifyQueue(event, showError), []),
  );

  useEventEmitter(
    globalEventBus,
    "NOTIFICATION_WARNING",
    React.useCallback((event: NotificationEventInterface) => notifyQueue(event, showWarn), []),
  );

  return <ToastContainer />;
}

export default React.memo(NotificationsContainer);
