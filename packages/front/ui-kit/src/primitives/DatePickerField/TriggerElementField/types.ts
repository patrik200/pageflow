import { CalendarInterface } from "primitives/Calendar";
import { TextFieldWrapperInterface } from "primitives/TextField";
import { InputFieldInterface } from "primitives/InputField";

export type TriggerElementFieldCommonInterface = Pick<CalendarInterface, "mode" | "minDate" | "maxDate"> &
  Omit<TextFieldWrapperInterface, "children"> &
  Pick<InputFieldInterface, "placeholder" | "disabled">;
