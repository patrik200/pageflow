export function removeMobXArrayLengthWarnings() {
  makeIgnoring(["[mobx] Out of bounds read:", "[mobx.array] Attempt to read an array index"]);
}

export function removeResizeObserverLoopLimitExceeded() {
  patchOnError(["ResizeObserver loop limit exceeded"]);
}

function makeIgnoring(ignorePatterns: string[]) {
  const originalConsoleWarning = console.warn;
  console.warn = (...args: any[]) => {
    const texts = args.map((arg) => arg.toString()).join("");
    const found = ignorePatterns.find((pattern) => texts.includes(pattern));
    if (found) return;
    originalConsoleWarning(...args);
  };
}

function patchOnError(ignorePatterns: string[]) {
  const onError = window.onerror as Function;
  window.onerror = function (err) {
    if (ignorePatterns.includes(err as string)) return false;
    // eslint-disable-next-line prefer-rest-params
    return onError(...arguments);
  };
}
