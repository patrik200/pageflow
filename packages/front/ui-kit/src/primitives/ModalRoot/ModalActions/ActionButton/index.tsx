import React from "react";
import cn from "classnames";

import Button, { ButtonInterface, ButtonType } from "primitives/Button";

import { buttonFitStyles } from "./style.css";

interface ActionButtonInterface extends Omit<ButtonInterface, "children" | "type" | "onClick"> {
  text: string;
  type: ButtonType;
  close: () => void;
  fit?: boolean;
  onClick?: (close: () => void) => void;
}

function ActionButton({ className, text, fit, onClick, close, ...props }: ActionButtonInterface) {
  const handleClick = React.useCallback(() => onClick && onClick(close), [close, onClick]);

  return (
    <Button {...props} className={cn(className, fit && buttonFitStyles)} onClick={handleClick}>
      {text}
    </Button>
  );
}

export default React.memo(ActionButton);
