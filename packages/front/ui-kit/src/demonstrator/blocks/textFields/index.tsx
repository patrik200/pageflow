import React from "react";
import { DateMode, IntlDate } from "@worksolutions/utils";

import {
  CalendarRange,
  DatePickerField,
  Icon,
  InputSize,
  MaskedField,
  PasswordField,
  PhoneField,
  PopupManagerMode,
  SelectField,
  TextField,
  Tooltip,
  Typography,
} from "main";

import { europeDateFormats } from "../calendar/dateFormats";

import {
  calendarWrapperStyles,
  datePickerStyles,
  eyeIconStyles,
  tooltipIconStyles,
  tooltipTextStyles,
  wrapperStyles,
} from "./style.css";

export function TextFieldsDemo() {
  const [size, setSize] = React.useState<InputSize>("default");

  const [inputValue, setInputValue] = React.useState("");
  const [range, setRange] = React.useState<CalendarRange>({
    min: undefined,
    max: undefined,
  });

  return (
    <div className={wrapperStyles}>
      <SelectField
        placeholder="size"
        value={size}
        options={[
          { value: "default", label: "default" },
          { value: "small", label: "small" },
        ]}
        onChange={setSize}
      />
      <TextField
        size={size}
        required
        materialPlaceholder={false}
        fieldItemLeft={<Icon className={eyeIconStyles} icon="eyeOnLine" />}
        fieldItemRight="eyeOffLine"
        value={inputValue}
        placeholder="placeholder"
        label="label"
        onChangeInput={setInputValue}
      />
      <MaskedField
        size={size}
        mask="+7 (&&&) &&&-&&-&&"
        fieldItemLeft="eyeOnLine"
        value={inputValue}
        placeholder="Masked text"
        label="Masked field"
        type="tel"
        onChangeInput={setInputValue}
      />
      <PasswordField size={size} value={inputValue} placeholder="Password" onChangeInput={setInputValue} />
      <PhoneField
        size={size}
        informer={
          <Tooltip
            triggerElement={<Icon className={tooltipIconStyles} icon="informationLine" />}
            mode={PopupManagerMode.CLICK}
            primaryPlacement="top-start"
            offset={[-20, 12]}
            popupElement={
              <Typography className={tooltipTextStyles}>
                some text some text some text some text some text some text some text some text some text some text
              </Typography>
            }
          />
        }
        value={inputValue}
        placeholder="phone text"
        label="Phone field"
        onChangeInput={setInputValue}
      />
      <TextField
        size={size}
        value={inputValue}
        hint="Error here"
        errorMessage={inputValue}
        fieldItemRight="pencilLine"
        onChangeInput={setInputValue}
      />
      <TextField
        size={size}
        value={inputValue}
        hint={inputValue}
        required
        placeholder="hint here"
        onChangeInput={setInputValue}
      />
      <div className={calendarWrapperStyles}>
        <DatePickerField
          className={datePickerStyles}
          presets={[{ title: "Previous week", onClick: console.log }]}
          strategy="fixed"
          mode={DateMode.DATE}
          value={inputValue}
          placeholder="Date picker"
          onChangeInput={setInputValue}
        />
        <DatePickerField
          className={datePickerStyles}
          materialPlaceholder={false}
          strategy="fixed"
          isRange
          mode={DateMode.DATE}
          rangeMin={range.min}
          rangeMax={range.max}
          placeholder="Date picker range"
          renderRangeValue={React.useCallback(
            (mode: DateMode, rangeMin: string | undefined, rangeMax: string | undefined) => {
              if (!rangeMin) return "";
              const min = intlDate.getDateTime(rangeMin, mode, intlDate.getCurrentDateTime().zone);
              if (!rangeMax) return `${intlDate.formatDate(min, DateMode.DAY_WITH_STRING_MONTH)} - `;
              const max = intlDate.getDateTime(rangeMax, mode, intlDate.getCurrentDateTime().zone);
              return `${intlDate.formatDate(min, DateMode.DAY_WITH_STRING_MONTH)} - ${intlDate.formatDate(
                max,
                DateMode.DAY_WITH_STRING_MONTH,
              )}`;
            },
            [],
          )}
          onChangeRange={setRange}
        />
      </div>
      <TextField
        value={inputValue}
        placeholder="placeholder"
        label="label"
        textArea
        rows={5}
        onChangeInput={setInputValue}
      />
    </div>
  );
}

const intlDate = new IntlDate({
  languageCode: "en",
  matchDateModeAndLuxonTypeLiteral: europeDateFormats,
});
