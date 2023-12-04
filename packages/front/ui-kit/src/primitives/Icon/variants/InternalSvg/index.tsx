import React from "react";

import { IconVariantProps } from "../types";

import { internalIcons } from "../../list";

function InternalSvg({ icon, ...props }: IconVariantProps<keyof typeof internalIcons>, ref: React.Ref<SVGSVGElement>) {
  const Icon = React.useMemo(() => internalIcons[icon], [icon]);
  return <Icon ref={ref} {...props} />;
}

export default React.forwardRef(InternalSvg);
