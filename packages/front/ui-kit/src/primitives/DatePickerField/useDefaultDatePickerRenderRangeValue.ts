import React from "react";
import { DateMode, IntlDate } from "@worksolutions/utils";

function defaultHasNoMaxValueFormatter(minValueString: string) {
  return `${minValueString} - `;
}

function defaultHasMinAndMaxValueFormatter(minValueString: string, maxValueString: string) {
  return `${minValueString} - ${maxValueString}`;
}

export function useDefaultDatePickerRenderRangeValue(
  intlDate: IntlDate,
  hasNoMaxValueFormatter = defaultHasNoMaxValueFormatter,
  hasMinAndMaxValueFormatter = defaultHasMinAndMaxValueFormatter,
) {
  return React.useCallback(
    (mode: DateMode, rangeMin: string | undefined, rangeMax: string | undefined) => {
      if (!rangeMin) return "";
      const min = intlDate.getDateTime(rangeMin, mode, intlDate.getCurrentDateTime().zone);
      const minString = intlDate.formatDate(min, DateMode.DAY_WITH_STRING_MONTH);
      if (!rangeMax) return hasNoMaxValueFormatter(minString);
      const max = intlDate.getDateTime(rangeMax, mode, intlDate.getCurrentDateTime().zone);
      const maxString = intlDate.formatDate(max, DateMode.DAY_WITH_STRING_MONTH);
      return hasMinAndMaxValueFormatter(minString, maxString);
    },
    [hasMinAndMaxValueFormatter, hasNoMaxValueFormatter, intlDate],
  );
}
