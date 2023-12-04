import React from "react";

import { SELECT_FIELD_OPTION_GROUP, SelectableListValue, SelectFieldOption, SelectField, Button } from "main";

import { iconStyles, customTextStyles, wrapperStyles } from "./style.css";

export function SelectFieldsDemo() {
  const [value, setValue] = React.useState<SelectableListValue>(null);

  const options: SelectFieldOption<SelectableListValue>[] = [
    { value: "", label: "All places", rightLayout: <div className={iconStyles} /> },
    { value: SELECT_FIELD_OPTION_GROUP as any, label: "Новая группа" },
    {
      className: customTextStyles,
      value: 1,
      labelNoWrap: true,
      label: "пр. Университетский, д. 44/50",
      secondaryLabel: "Breakfasteria",
      rightLayout: <div className={iconStyles} />,
    },
    {
      value: 2,
      label: "Краснодар, Гаражная 71/1",
      secondaryLabel: "Bumerang",
      leftLayout: "calendarLine",
    },
  ];

  const customFieldValueText = (option: SelectFieldOption<SelectableListValue>) =>
    option.secondaryLabel ? option.label + ", " + option.secondaryLabel : option.label;

  return (
    <div className={wrapperStyles}>
      <SelectField
        searchable
        searchPlaceholder="Найти"
        emptyListText="Не найдено"
        dots
        inputFieldWrapperClassName={value === 1 ? customTextStyles : undefined}
        required
        popupWidth="auto"
        strategy="fixed"
        placeholder="placeholder"
        value={value}
        customFieldValueText={customFieldValueText}
        options={options}
        onChange={setValue}
        onSearchFieldSubmit={(str) => console.log("submit", str)}
      />
      <SelectField
        inputFieldWrapperClassName={value === 1 ? customTextStyles : undefined}
        required
        popupWidth="auto"
        strategy="fixed"
        placeholder="placeholder"
        value={value}
        customFieldValueText={customFieldValueText}
        options={options}
        onChange={setValue}
      />
      <SelectField
        required
        popupWidth="auto"
        strategy="fixed"
        placeholder="placeholder"
        size="small"
        value={value}
        customFieldValueText={customFieldValueText}
        options={options}
        onChange={setValue}
      />
      <Button onClick={() => setValue(null)}>Clear</Button>
    </div>
  );
}
