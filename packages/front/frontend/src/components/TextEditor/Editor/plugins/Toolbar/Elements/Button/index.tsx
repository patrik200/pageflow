import React from "react";
import { Icon, InternalIcons } from "@app/ui-kit";
import cn from "classnames";

import { buttonDisabledStyles, buttonEnabledStyles, buttonStyles, iconStyles } from "./style.css";

interface ToolbarButtonInterface {
  enabled?: boolean;
  icon: InternalIcons;
  disabled?: boolean;
  onClick?: () => void;
}

function ToolbarButton(
  { enabled, icon, disabled, onClick }: ToolbarButtonInterface,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(buttonStyles, enabled && buttonEnabledStyles, disabled && buttonDisabledStyles)}
      onClick={onClick}
    >
      <Icon className={iconStyles} icon={icon} />
    </button>
  );
}

export default React.memo(React.forwardRef(ToolbarButton));
