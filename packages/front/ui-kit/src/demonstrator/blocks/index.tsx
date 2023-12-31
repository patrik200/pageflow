import { registerDemoComponent, sortRegisteredComponents } from "../registrar";
import { PopupManagerDemo } from "./popupManager";
import { TypographyDemo } from "./typography";
import { ButtonsDemo } from "./buttons";
import { IconsDemo } from "./icons";
import { TextFieldsDemo } from "./textFields";
import { ModalDemo } from "./modal";
import { PopupSelectableListDemo } from "./popupSelectableList";
import { SelectFieldsDemo } from "./selectFields";
import { TableDemo } from "./table";
import { CheckboxesDemo } from "./checkboxes";
import { TabsDemo } from "./tabs";
import { SpinnerDemo } from "./spinner";
import { CalendarDemo } from "./calendar";
import { SwitchDemo } from "./switch";
import { ScrollDemo } from "./scroll";
import { DraggableListDemo } from "./draggableList";
import { ProgressBarDemo } from "./progressBar";
import { TooltipDemo } from "./tooltip";
import { ColorsDemo } from "./colors";
import { BadgesDemo } from "./badges";
import { CopyToClipboardDemo } from "./copyToClipboard";

registerDemoComponent("Popup manager", PopupManagerDemo);
registerDemoComponent("Typography", TypographyDemo);
registerDemoComponent("Buttons", ButtonsDemo);
registerDemoComponent("Icon", IconsDemo);
registerDemoComponent("Text fields", TextFieldsDemo);
registerDemoComponent("Modal windows", ModalDemo);
registerDemoComponent("Popup selectable list", PopupSelectableListDemo);
registerDemoComponent("Select field", SelectFieldsDemo);
registerDemoComponent("Table", TableDemo);
registerDemoComponent("Checkboxes and radio", CheckboxesDemo);
registerDemoComponent("Tabs", TabsDemo);
registerDemoComponent("Spinner", SpinnerDemo);
registerDemoComponent("Calendar", CalendarDemo);
registerDemoComponent("Switch", SwitchDemo);
registerDemoComponent("Scroll", ScrollDemo);
registerDemoComponent("Draggable", DraggableListDemo);
registerDemoComponent("Progress bar", ProgressBarDemo);
registerDemoComponent("Tooltip", TooltipDemo);
registerDemoComponent("Colors", ColorsDemo);
registerDemoComponent("Badges", BadgesDemo);
registerDemoComponent("Copy to clipboard", CopyToClipboardDemo);

sortRegisteredComponents();
