import React from "react";
import { DateMode, IntlDate } from "@worksolutions/utils";

import { Calendar, CalendarRange } from "main";

import { europeDateFormats } from "./dateFormats";

import { wrapperStyles } from "./style.css";

const intlDate = new IntlDate({
  languageCode: "ru",
  matchDateModeAndLuxonTypeLiteral: europeDateFormats,
});

export function CalendarDemo() {
  const [value, setValue] = React.useState<string | undefined>(() =>
    intlDate.formatDate(intlDate.getCurrentDateTime(), DateMode.DATE),
  );
  const [range, setRange] = React.useState<CalendarRange>({
    min: "26.05.2022",
    max: undefined,
  });

  return (
    <div className={wrapperStyles}>
      <Calendar
        presets={[
          {
            title: "add 3 days",
            onClick: () =>
              setValue(intlDate.formatDate(intlDate.getCurrentDateTime().plus({ days: 3 }), DateMode.DATE)),
          },
        ]}
        minDate={intlDate.formatDate(intlDate.getCurrentDateTime(), DateMode.DATE)}
        value={value}
        mode={DateMode.DATE}
        onChange={setValue}
      />
      <Calendar
        currentDateByDefault={false}
        value={undefined}
        rangeMin={range.min}
        rangeMax={range.max}
        isRange
        mode={DateMode.DATE}
        onChangeRange={setRange}
      />
    </div>
  );
}
