import React from "react";

import TextRenderer from "../Text";

interface EnumRendererInterface {
  value: string | null;
  options: Record<string, any>;
}

function EnumRenderer({ value, options }: EnumRendererInterface) {
  return <TextRenderer value={value ? options[value] : null} />;
}

export default React.memo(EnumRenderer);
