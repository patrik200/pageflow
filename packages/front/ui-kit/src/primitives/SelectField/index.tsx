import React from "react";
import { isSymbol } from "@worksolutions/utils";
import cn from "classnames";
import { useEffectSkipFirst } from "@worksolutions/react-utils";

import PopupSelectableList, {
  SelectableListItem,
  SelectableListItemGroup,
  SelectableListItemGroupInterface,
  SelectableListValue,
} from "primitives/PopupSelectableList";
import { TextFieldWrapperInterface } from "primitives/TextField/TextFieldWrapper";
import { PopupManagerInterface } from "primitives/PopupManager";
import { SelectableListItemInterface } from "primitives/PopupSelectableList/SelectableList/SelectableListItem";
import { InputFieldWrapperInterface } from "primitives/InputField";
import { IconOrElementType } from "primitives/Icon";
import { ScrollProviderContextInterface } from "primitives/ScrollProvider";

import SelectFieldTrigger, { SelectFieldTriggerInterface } from "./Trigger";
import BeforeList from "./BeforeList";
import EmptyList from "./EmptyList";

import { useViewOptions } from "./hooks";

import { hiddenSelectableListItemStyles } from "./style.css";

export interface SelectFieldOption<ValueType extends SelectableListValue, HAS_SYMBOL = false> {
  className?: string;
  key_postfix?: string;
  label: string;
  labelNoWrap?: boolean;
  hidden?: boolean;
  value: HAS_SYMBOL extends true ? ValueType | Symbol : ValueType;
  secondaryLabel?: string;
  rightLayout?: IconOrElementType;
  leftLayout?: IconOrElementType;
}

export const SELECT_FIELD_OPTION_GROUP = Symbol("select-option-group");

export type SelectFieldInterface<ValueType extends SelectableListValue> = Omit<
  TextFieldWrapperInterface,
  "children"
> & {
  value: ValueType;
  searchable?: boolean;
  customOnSearch?: (searchString: string) => void;
  emptyListText?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  options: SelectFieldOption<ValueType, true | false>[];
  scrollProviderRef?: React.Ref<ScrollProviderContextInterface>;
  closePopupSelectAfterChange?: boolean;
  CustomTrigger?: React.FC<SelectFieldTriggerInterface>;
  DesktopSelectableListItem?: React.FC<SelectableListItemInterface<ValueType>>;
  DesktopSelectableListItemGroup?: React.FC<SelectableListItemGroupInterface>;
  beforeList?: React.ReactNode;
  afterList?: React.ReactNode;
  emptyList?: React.ReactNode;
  desktopPopupClassName?: string;
  selectableListItemClassName?: string;
  dots?: boolean;
  useOptionsLeftLayoutAsFieldItemLeft?: boolean;
  onChange: (value: ValueType) => void;
  customFieldValueText?: (option: SelectFieldOption<ValueType>) => string;
  onSearchFieldSubmit?: (search: string) => void;
} & Pick<
    SelectFieldTriggerInterface,
    "disabled" | "loading" | "fieldItemLeft" | "materialPlaceholder" | "inputFieldWrapperClassName" | "size"
  > &
  Pick<PopupManagerInterface, "strategy" | "primaryPlacement" | "offset" | "maxHeight" | "popupWidth">;

function SelectField<ValueType extends SelectableListValue>({
  style,
  className,
  searchable,
  customOnSearch,
  emptyListText,
  searchPlaceholder,
  options,
  value,
  placeholder,
  disabled,
  loading,
  strategy,
  primaryPlacement,
  offset,
  maxHeight,
  popupWidth,
  CustomTrigger,
  DesktopSelectableListItem = SelectableListItem,
  DesktopSelectableListItemGroup = SelectableListItemGroup,
  closePopupSelectAfterChange,
  beforeList,
  afterList,
  emptyList,
  desktopPopupClassName,
  selectableListItemClassName,
  fieldItemLeft: fieldItemLeftProp,
  useOptionsLeftLayoutAsFieldItemLeft,
  scrollProviderRef,
  onChange,
  customFieldValueText,
  onSearchFieldSubmit,
  ...props
}: SelectFieldInterface<ValueType>) {
  const [search, setSearch] = React.useState("");
  useEffectSkipFirst(() => customOnSearch?.(search), [customOnSearch, search]);

  const viewOptions = useViewOptions(!customOnSearch, search, options);

  const { value: fieldValue, fieldItemLeft } = useSelectFieldValue(value, options, {
    fieldItemLeft: fieldItemLeftProp,
    customFieldValueText,
    useOptionsLeftLayoutAsFieldItemLeft,
  });

  const handleSelect = React.useCallback(
    (value: ValueType) => {
      const activeOption = options.find((option) => option.value === value);
      if (!activeOption) return;
      if (isSymbol(activeOption.value)) return;
      onChange(activeOption.value);
    },
    [options, onChange],
  );

  const resultDisabled = disabled || loading;

  return (
    <PopupSelectableList
      className={desktopPopupClassName}
      disabled={resultDisabled}
      strategy={strategy}
      primaryPlacement={primaryPlacement}
      offset={offset}
      maxHeight={maxHeight}
      popupWidth={popupWidth}
      closeOnChange={closePopupSelectAfterChange}
      beforeList={
        <>
          {searchable && (
            <BeforeList
              search={search}
              searchPlaceholder={searchPlaceholder ?? ""}
              setSearch={setSearch}
              onSubmit={onSearchFieldSubmit}
            />
          )}
          {beforeList}
        </>
      }
      afterList={afterList}
      emptyList={emptyList ?? (emptyListText && <EmptyList emptyListText={emptyListText} />)}
      scrollProviderRef={scrollProviderRef}
      onSelect={handleSelect}
      triggerElement={
        CustomTrigger ? (
          <CustomTrigger
            style={style}
            className={className}
            disabled={resultDisabled}
            loading={loading}
            fieldValue={fieldValue}
            placeholder={placeholder}
            fieldItemLeft={fieldItemLeft}
            {...props}
          />
        ) : (
          <SelectFieldTrigger
            style={style}
            className={className}
            disabled={resultDisabled}
            loading={loading}
            fieldValue={fieldValue}
            placeholder={placeholder}
            fieldItemLeft={fieldItemLeft}
            {...props}
          />
        )
      }
    >
      {getOptionElements(
        viewOptions,
        value,
        {
          SelectableListItem: DesktopSelectableListItem,
          SelectableListItemGroup: DesktopSelectableListItemGroup,
        },
        { selectableListItemClassName },
      )}
    </PopupSelectableList>
  );
}

export default React.memo(SelectField) as <ValueType extends SelectableListValue>(
  props: SelectFieldInterface<ValueType>,
) => React.JSX.Element;

export { default as SelectFieldTrigger } from "./Trigger";
export type { SelectFieldTriggerInterface } from "./Trigger";

export function useSelectFieldValue<ValueType extends SelectableListValue>(
  value: ValueType,
  options: SelectFieldOption<ValueType>[],
  {
    fieldItemLeft,
    useOptionsLeftLayoutAsFieldItemLeft = true,
    customFieldValueText,
  }: {
    fieldItemLeft?: InputFieldWrapperInterface["fieldItemLeft"];
    useOptionsLeftLayoutAsFieldItemLeft?: boolean;
    customFieldValueText?: (option: SelectFieldOption<ValueType>) => string;
  } = {},
) {
  return React.useMemo(() => {
    if (value === null) return { value: "", fieldItemLeft, activeOption: null };
    const activeOption = options.find((option) => option.value === value);
    if (!activeOption) return { value: "", fieldItemLeft, activeOption: null };
    return {
      activeOption,
      value: customFieldValueText ? customFieldValueText(activeOption) : activeOption.label,
      fieldItemLeft: useOptionsLeftLayoutAsFieldItemLeft ? activeOption.leftLayout || fieldItemLeft : fieldItemLeft,
    };
  }, [customFieldValueText, fieldItemLeft, options, useOptionsLeftLayoutAsFieldItemLeft, value]);
}

function getOptionElements(
  options: SelectFieldOption<any>[],
  selectedValue: SelectableListValue,
  {
    SelectableListItem,
    SelectableListItemGroup,
  }: {
    SelectableListItem: React.FC<SelectableListItemInterface<any>>;
    SelectableListItemGroup: React.FC<SelectableListItemGroupInterface>;
  },
  { selectableListItemClassName }: { selectableListItemClassName?: string },
) {
  return options.map(
    ({ className, value, secondaryLabel, label, rightLayout, leftLayout, labelNoWrap, hidden, key_postfix }) => {
      const key = String(value) + label + secondaryLabel + key_postfix;

      if (value === SELECT_FIELD_OPTION_GROUP)
        return (
          <SelectableListItemGroup
            key={key}
            className={className}
            mainLayout={label}
            // @ts-ignore
            __hidden={hidden}
          />
        );

      return (
        <SelectableListItem
          key={key}
          className={cn(selectableListItemClassName, className, hidden && hiddenSelectableListItemStyles)}
          value={value}
          mainLayout={label}
          mainLayoutNoWrap={labelNoWrap}
          secondaryLayout={secondaryLabel}
          leftLayout={leftLayout}
          rightLayout={rightLayout}
          selected={value === selectedValue && selectedValue !== null}
          // @ts-ignore
          __hidden={hidden}
        />
      );
    },
  );
}

export { default as SelectCheckboxesAndSearchEmptyList } from "./EmptyList";
export type { SelectCheckboxesAndSearchEmptyListInterface } from "./EmptyList";
export { default as SelectCheckboxesAndSearchBeforeList } from "./BeforeList";
export type { SelectCheckboxesAndSearchBeforeListInterface } from "./BeforeList";
