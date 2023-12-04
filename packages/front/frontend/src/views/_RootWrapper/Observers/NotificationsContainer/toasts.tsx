import { toast, ToastOptions } from "react-toastify";
import { Typography } from "@app/ui-kit";

import { textStyles } from "./style.css";

const defaultToastOptions: Partial<ToastOptions> = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export function showError(message: string, options?: ToastOptions) {
  toast.error(<Text message={message} />, {
    ...defaultToastOptions,
    ...options,
  });
}

export function showSuccess(message: string, options?: ToastOptions) {
  toast.success(<Text message={message} />, {
    ...defaultToastOptions,
    ...options,
  });
}

export function showWarn(message: string, options?: ToastOptions) {
  toast.warning(<Text message={message} />, {
    ...defaultToastOptions,
    ...options,
  });
}

function Text({ message }: { "data-id"?: string; message: string }) {
  return <Typography className={textStyles}>{message}</Typography>;
}
