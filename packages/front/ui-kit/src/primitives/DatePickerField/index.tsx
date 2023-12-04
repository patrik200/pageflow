import React from "react";

import PopupManager, { PopupComponent, PopupManagerInterface, PopupManagerMode } from "primitives/PopupManager";
import Calendar, { CalendarContext, CalendarInterface } from "primitives/Calendar";
import { TextFieldWrapperInterface } from "primitives/TextField";
import { InputFieldInterface } from "primitives/InputField";

import TriggerElementField, { TriggerElementFieldInterface } from "./TriggerElementField";
import { useDefaultDatePickerRenderRangeValue } from "./useDefaultDatePickerRenderRangeValue";

export type DatePickerFieldInterface = Omit<CalendarInterface, "onChange" | "className"> &
  Pick<PopupManagerInterface, "strategy" | "primaryPlacement" | "offset" | "popupWidth"> &
  Omit<TriggerElementFieldInterface, "size" | "theme" | "renderRangeValue"> &
  Partial<Pick<TriggerElementFieldInterface, "renderRangeValue">> &
  Omit<TextFieldWrapperInterface, "children" | "className"> &
  Pick<InputFieldInterface, "placeholder" | "autoFocus">;

function DatePickerField({
  className,
  presets,
  mode,
  currentDateByDefault,
  rangeMax,
  rangeMin,
  isRange,
  value,
  minDate,
  maxDate,
  onChangeRange,
  onChangeInput,
  strategy,
  primaryPlacement,
  disabled,
  offset,
  popupWidth,
  label,
  fixedHeight,
  renderRangeValue: renderRangeValueProps,
  ...props
}: DatePickerFieldInterface) {
  const { intlDate } = React.useContext(CalendarContext);

  const defaultDatePickerRenderRangeValue = useDefaultDatePickerRenderRangeValue(intlDate);
  const renderRangeValue = renderRangeValueProps || defaultDatePickerRenderRangeValue;

  const calendarElement = (
    <Calendar
      presets={presets}
      mode={mode}
      currentDateByDefault={currentDateByDefault}
      rangeMin={rangeMin}
      rangeMax={rangeMax}
      isRange={isRange}
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      fixedHeight={fixedHeight}
      onChangeRange={onChangeRange}
      onChange={onChangeInput}
    />
  );

  return (
    <PopupManager
      strategy={strategy}
      disabled={disabled}
      offset={offset}
      maxHeight={false}
      popupWidth={popupWidth}
      mode={PopupManagerMode.CLICK}
      primaryPlacement={primaryPlacement}
      triggerElement={
        <TriggerElementField
          className={className}
          mode={mode}
          renderRangeValue={renderRangeValue}
          isRange={isRange}
          disabled={disabled}
          label={label}
          value={value}
          rangeMin={rangeMin}
          rangeMax={rangeMax}
          onChangeInput={onChangeInput}
          {...props}
        />
      }
      popupElement={<PopupComponent>{calendarElement}</PopupComponent>}
    />
  );
}

export default React.memo(DatePickerField);

export { useDefaultDatePickerRenderRangeValue } from "./useDefaultDatePickerRenderRangeValue";
