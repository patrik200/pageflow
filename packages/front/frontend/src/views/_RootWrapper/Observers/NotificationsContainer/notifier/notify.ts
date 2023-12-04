import { ToastContentProps, ToastOptions } from "react-toastify";

import { globalEventBus } from "core/eventBus";

export interface NotificationEventInterface {
  message: string;
  options?: ToastOptions;
}

export function notify(
  id: string,
  event: NotificationEventInterface & {},
  showNotification: (message: string, options?: ToastOptions) => void,
) {
  let element: HTMLElement | null = null;

  showNotification(event.message, {
    ...event.options,
    position: "bottom-right",
    theme: "dark",
    toastId: "toast_" + id,
    onOpen(props) {
      event.options?.onOpen?.(props);
      element = document.getElementById((props as any as ToastContentProps).toastProps.toastId as string)!;
      globalEventBus.emit("ADD_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT", element);
    },
    onClose(props) {
      event.options?.onClose?.(props);
      globalEventBus.emit("REMOVE_MODAL_IGNORE_CLICK_OUTSIDE_ELEMENT", element!);
    },
  });
}
