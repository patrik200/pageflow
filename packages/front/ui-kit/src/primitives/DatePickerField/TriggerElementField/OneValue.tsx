import React from "react";
import { useEffectSkipFirst } from "@worksolutions/react-utils";

import MaskedField, { MaskedFieldInterface } from "primitives/MaskedField";
import { CalendarInterface, useCalendarDateTime } from "primitives/Calendar";

import { ComponentWithRef } from "types";

import { TriggerElementFieldCommonInterface } from "./types";

type OneValueInterface = { value: string } & Pick<CalendarInterface, "mode"> &
  Pick<MaskedFieldInterface, "onChangeInput"> &
  TriggerElementFieldCommonInterface;

function OneValue({ value, mode, onChangeInput, ...props }: OneValueInterface, ref: React.Ref<HTMLDivElement>) {
  const [inputValue, setInputValue] = React.useState(value || "");
  useEffectSkipFirst(() => setInputValue(value || ""), [value]);

  const getCalendarDateTime = useCalendarDateTime();

  useEffectSkipFirst(() => {
    if (inputValue === "") {
      onChangeInput?.(inputValue);
      return;
    }
    const dateTime = getCalendarDateTime(inputValue, mode);
    if (!dateTime.isValid) return;
    onChangeInput?.(inputValue);
  }, [getCalendarDateTime, inputValue, mode, onChangeInput]);

  return (
    <MaskedField
      ref={ref}
      fieldItemRight="calendarLine"
      {...props}
      value={inputValue}
      onChangeInput={setInputValue}
      mask="&&.&&.&&&&"
    />
  );
}

export default React.memo(React.forwardRef(OneValue)) as ComponentWithRef<OneValueInterface, HTMLDivElement>;
