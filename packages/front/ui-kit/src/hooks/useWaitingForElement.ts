import React from "react";

export function useWaitingForElement(
  onAppear: (element: HTMLElement | undefined) => void,
  selector: string | undefined,
  { timeout = 5000, checkInterval = 400, root }: { timeout?: number; checkInterval?: number; root?: HTMLElement } = {},
) {
  const initObserver = React.useCallback(
    (root: HTMLElement, selector: string) => {
      function check() {
        const element = root.querySelector(selector);
        if (!element) return;
        dispose();
        onAppear(element as HTMLElement);
      }
      function dispose() {
        clearInterval(checkNodeInterval);
        clearTimeout(timeoutNodeInterval);
      }
      const checkNodeInterval = setInterval(check, checkInterval);
      const timeoutNodeInterval = setTimeout(() => {
        dispose();
        onAppear(undefined);
      }, timeout);

      return dispose;
    },
    [checkInterval, onAppear, timeout],
  );

  return React.useCallback(() => {
    if (!selector) return;
    const resultRoot = root || document.body;
    const element = resultRoot.querySelector(selector);
    if (element) {
      onAppear(element as HTMLElement);
      return;
    }

    return initObserver(resultRoot, selector);
  }, [initObserver, onAppear, root, selector]);
}
