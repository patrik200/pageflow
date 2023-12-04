import React from "react";

import TextRenderer from "../Text";

interface BooleanRendererInterface {
  value: boolean;
  options: Record<string, any>;
}

function BooleanRenderer({ value, options }: BooleanRendererInterface) {
  if (value === true) return <TextRenderer value={options.true} />;
  if (value === false) return <TextRenderer value={options.false} />;
  return null;
}

export default React.memo(BooleanRenderer);
