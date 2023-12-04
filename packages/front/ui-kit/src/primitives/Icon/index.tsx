import React from "react";
import { isDeepEqual, isPureObject, isString, string1, memoizeWith } from "@worksolutions/utils";
import cn from "classnames";

import { ComponentWithRef } from "types";

import InternalSvg from "./variants/InternalSvg";
import { internalIcons } from "./list";

import { iconStyle } from "./style.css";
import { iconScaleStyles } from "./listScale.css";

export type InternalIcons = keyof typeof internalIcons;

export interface IconInterface {
  className?: string;
  style?: Record<string, string>;
  icon: InternalIcons | string;
  onClick?: (ev: React.MouseEvent<any>) => void;
}

const isInternalIcon = memoizeWith(string1, function (icon: string): icon is InternalIcons {
  return isPureObject(internalIcons[icon as InternalIcons]);
});

function Icon({ className, icon, ...props }: IconInterface, ref: React.Ref<SVGSVGElement>) {
  if (!icon) return null;

  if (isInternalIcon(icon))
    return (
      <InternalSvg
        ref={ref}
        className={cn(className, iconStyle, "icon", "internal-icon-" + icon, iconScaleStyles)}
        icon={icon}
        {...props}
      />
    );

  return null;
}

const IconComponent = React.memo(React.forwardRef(Icon), isDeepEqual) as ComponentWithRef<IconInterface, SVGSVGElement>;
export default IconComponent;

export { internalIcons } from "./list";

export function addInternalIcon(iconName: string, iconComponent: React.FC<any>) {
  (internalIcons as any)[iconName] = iconComponent;
}

export type IconOrElementType = InternalIcons | React.JSX.Element | string;
export const IconOrElement = React.memo(function ({ icon }: { icon: IconOrElementType }) {
  return <>{isString(icon) ? <IconComponent icon={icon as InternalIcons} /> : icon}</>;
});
