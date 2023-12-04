import React from "react";

import { prepareNumberToLibPhoneNumber } from "utils";

export function useInternalPhoneInput(value: string, onChangeInput: (phone: string) => void) {
  const handleChange = React.useCallback(
    (rawValue: string) => {
      const value = rawValue ?? "";
      if (value.length === 2) {
        onChangeInput("+");
        setTimeout(() => onChangeInput(value), 1);
      } else {
        onChangeInput(value);
      }
    },
    [onChangeInput],
  );

  const newValue = React.useMemo(() => prepareNumberToLibPhoneNumber(value), [value]);
  return [newValue, handleChange] as const;
}
