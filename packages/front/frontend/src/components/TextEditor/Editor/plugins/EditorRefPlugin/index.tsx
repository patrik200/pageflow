import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export interface EditorRef {
  clear: () => void;
}

interface EditorRefPluginInterface {
  innerRef: React.Ref<EditorRef> | undefined;
}

function EditorRefPlugin({ innerRef }: EditorRefPluginInterface) {
  const [editor] = useLexicalComposerContext();
  React.useImperativeHandle(innerRef, () => ({ clear: () => editor.update(() => $getRoot().clear()) }), [editor]);
  return null;
}

export default React.memo(EditorRefPlugin);
