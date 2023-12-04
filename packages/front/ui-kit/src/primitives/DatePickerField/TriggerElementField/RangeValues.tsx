import React from "react";
import { DateMode } from "@worksolutions/utils";

import { CalendarInterface } from "primitives/Calendar";
import { SelectFieldTrigger } from "primitives/SelectField";

import { ComponentWithRef } from "types";

import { TriggerElementFieldCommonInterface } from "./types";

type RangeValuesInterface = Pick<CalendarInterface, "onChangeRange" | "rangeMin" | "rangeMax"> & {
  renderRangeValue: (mode: DateMode, rangeMin: string | undefined, rangeMax: string | undefined) => string;
} & TriggerElementFieldCommonInterface;

function RangeValues(
  { mode, rangeMin, rangeMax, renderRangeValue, ...props }: RangeValuesInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const fieldValue = React.useMemo(
    () => renderRangeValue(mode, rangeMin, rangeMax),
    [mode, rangeMax, rangeMin, renderRangeValue],
  );

  return <SelectFieldTrigger ref={ref} fieldValue={fieldValue} fieldItemRight="calendarLine" {...props} />;
}

export default React.memo(React.forwardRef(RangeValues)) as ComponentWithRef<RangeValuesInterface, HTMLDivElement>;
