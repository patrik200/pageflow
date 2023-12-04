import { buttonSizeStyleVariants, buttonStyleVariants } from "./style.css";

export type ButtonType = keyof typeof buttonStyleVariants;
export type ButtonSize = keyof typeof buttonSizeStyleVariants;
