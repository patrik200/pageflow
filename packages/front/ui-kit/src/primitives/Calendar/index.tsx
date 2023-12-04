import React from "react";
import { DateMode, isArray } from "@worksolutions/utils";
import cn from "classnames";

import Spinner from "primitives/Spinner";
import Button from "primitives/Button";

import { ComponentWithRef } from "types";
import { dynamicImportFixDefault } from "utils";

import { CalendarContext } from "./Context";

import { calendarStyles, presetsStyles, spinnerStyles } from "./style.css";

export type CalendarValue = string | undefined;

export interface CalendarRange {
  min: string | undefined;
  max: string | undefined;
}

export interface CalendarPreset {
  title: string;
  onClick: () => void;
}

export interface CalendarInterface {
  className?: string;
  mode: DateMode;
  presets?: CalendarPreset[];
  fixedHeight?: boolean;
  currentDateByDefault?: boolean;
  rangeMin?: CalendarRange["min"];
  rangeMax?: CalendarRange["max"];
  minDate?: string;
  maxDate?: string;
  value?: CalendarValue;
  isRange?: boolean;
  onChange?: (value: string) => void;
  onChangeRange?: (value: { min: string; max: string | undefined }) => void;
  onCalendarLoaded?: () => void;
}

export function useCalendarDateTime() {
  const { intlDate } = React.useContext(CalendarContext);
  return React.useCallback(
    (date: string, mode: DateMode) => intlDate.getDateTime(date, mode, intlDate.getCurrentDateTime().zone),
    [intlDate],
  );
}

function Calendar(
  {
    className,
    presets,
    fixedHeight = true,
    value,
    rangeMin,
    rangeMax,
    minDate: minDateProp,
    maxDate: maxDateProp,
    mode,
    isRange,
    currentDateByDefault = false,
    onChange,
    onChangeRange,
    onCalendarLoaded,
    ...otherProps
  }: CalendarInterface,
  ref: React.Ref<HTMLDivElement>,
) {
  const { intlDate, language } = React.useContext(CalendarContext);

  const LazyReactDatePicker = React.useMemo(
    () =>
      React.lazy(() =>
        Promise.all([dynamicImportFixDefault(import("react-datepicker")), import("date-fns/locale/ru")]).then(
          ([module, ruLocale]) => {
            module.registerLocale("ru", ruLocale.default);
            return module;
          },
        ),
      ),
    [],
  );

  const getCalendarDateTime = useCalendarDateTime();

  const formatJsDateToMode = React.useCallback(
    (date: Date) => intlDate.formatDate(getCalendarDateTime(date.toISOString(), DateMode.__UNIVERSAL_ISO), mode),
    [getCalendarDateTime, intlDate, mode],
  );

  const formatStringDateToJs = React.useCallback(
    (date: string) => {
      const dateTime = getCalendarDateTime(date, mode);
      if (!dateTime.isValid) return null;
      return dateTime.toJSDate();
    },
    [getCalendarDateTime, mode],
  );

  const selectedValue = React.useMemo(
    () =>
      value ? formatStringDateToJs(value) : currentDateByDefault ? intlDate.getCurrentDateTime().toJSDate() : null,
    [currentDateByDefault, formatStringDateToJs, intlDate, value],
  );

  const startDate = React.useMemo(
    () => (rangeMin ? formatStringDateToJs(rangeMin) : undefined),
    [formatStringDateToJs, rangeMin],
  );
  const endDate = React.useMemo(
    () => (rangeMax ? formatStringDateToJs(rangeMax) : undefined),
    [formatStringDateToJs, rangeMax],
  );

  const minDate = React.useMemo(
    () => (minDateProp ? formatStringDateToJs(minDateProp) : undefined),
    [formatStringDateToJs, minDateProp],
  );
  const maxDate = React.useMemo(
    () => (maxDateProp ? formatStringDateToJs(maxDateProp) : undefined),
    [formatStringDateToJs, maxDateProp],
  );

  const handleChange = React.useCallback(
    (newDate: Date | [Date, Date | null]) => {
      if (!isArray(newDate)) {
        if (onChange) onChange(formatJsDateToMode(newDate));
        return;
      }

      const [min, max] = newDate;
      if (onChangeRange)
        onChangeRange({ min: formatJsDateToMode(min), max: max ? formatJsDateToMode(max) : undefined });
    },
    [formatJsDateToMode, onChange, onChangeRange],
  );

  const handleCalendarLoaded = React.useCallback(
    (ref: any) => {
      if (!ref || !onCalendarLoaded) return;
      onCalendarLoaded();
    },
    [onCalendarLoaded],
  );

  return (
    <div ref={ref} className={cn(className, calendarStyles)} {...otherProps}>
      {presets && presets.length !== 0 && (
        <div className={presetsStyles}>
          {presets.map((preset, index) => (
            <Button key={index} size="SMALL" type="OUTLINE" onClick={preset.onClick}>
              {preset.title}
            </Button>
          ))}
        </div>
      )}
      <React.Suspense fallback={<Spinner className={spinnerStyles} />}>
        <LazyReactDatePicker
          locale={language}
          ref={handleCalendarLoaded}
          nextMonthButtonLabel=""
          previousMonthButtonLabel=""
          inline
          calendarStartDay={1}
          minDate={minDate}
          maxDate={maxDate}
          selected={selectedValue}
          startDate={startDate}
          endDate={endDate}
          selectsRange={isRange}
          fixedHeight={fixedHeight}
          onChange={handleChange}
        />
      </React.Suspense>
    </div>
  );
}

export default React.memo(React.forwardRef(Calendar)) as ComponentWithRef<CalendarInterface, HTMLDivElement>;

export { CalendarContext } from "./Context";
export type { AvailableCalendarLanguages, CalendarContextInterface } from "./Context";
