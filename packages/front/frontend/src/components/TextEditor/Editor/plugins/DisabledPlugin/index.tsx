import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface DisabledPluginInterface {
  disabled: boolean | undefined;
}

function DisabledPlugin({ disabled = false }: DisabledPluginInterface) {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => editor.update(() => editor.setEditable(!disabled)), [disabled, editor]);
  return null;
}

export default React.memo(DisabledPlugin);
