import React from "react";
import { DateMode } from "@worksolutions/utils";

import { CalendarInterface, CalendarValue } from "primitives/Calendar";
import { MaskedFieldInterface } from "primitives/MaskedField";

import { ComponentWithRef } from "types";

import { TriggerElementFieldCommonInterface } from "./types";

import OneValue from "./OneValue";
import RangeValues from "./RangeValues";

export type TriggerElementFieldInterface = TriggerElementFieldCommonInterface & {
  isRange?: boolean;
  value?: CalendarValue;
  renderRangeValue: (mode: DateMode, rangeMin: string | undefined, rangeMax: string | undefined) => string;
} & Pick<CalendarInterface, "rangeMin" | "rangeMax"> &
  Pick<MaskedFieldInterface, "onChangeInput" | "materialPlaceholder">;

function TriggerElementField(
  { value, isRange, rangeMin, rangeMax, renderRangeValue, onChangeInput, ...props }: TriggerElementFieldInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  if (isRange)
    return (
      <RangeValues ref={ref} rangeMin={rangeMin} rangeMax={rangeMax} renderRangeValue={renderRangeValue} {...props} />
    );

  return <OneValue ref={ref} value={value || ""} onChangeInput={onChangeInput} {...props} />;
}

export default React.memo(React.forwardRef(TriggerElementField)) as ComponentWithRef<
  TriggerElementFieldInterface,
  HTMLDivElement
>;
