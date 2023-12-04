import React from "react";
import { Typography } from "@app/ui-kit";

import { FormFieldTextEmptyView } from "components/FormField/Text";
import EditorText from "components/TextEditor/EditorText";

import { textStyles } from "./style.css";

interface TextRendererInterface {
  value: string | null;
  options?: Record<string, any>;
}

function TextRenderer({ value, options = {} }: TextRendererInterface) {
  if (!value) return <FormFieldTextEmptyView />;
  if (options.asHTML) return <EditorText text={value} />;
  return <Typography className={textStyles}>{value}</Typography>;
}

export default React.memo(TextRenderer);
