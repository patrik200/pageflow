import dynamic from "next/dynamic";
import React from "react";

import type { EditorComponentInterface, EditorRef } from "./Editor";

export type TextEditorInterface = Omit<EditorComponentInterface, "innerRef">;

const Editor = dynamic(() => import("./Editor"), { ssr: false });

function TextEditor(props: TextEditorInterface, ref: React.Ref<EditorRef>) {
  return <Editor innerRef={ref} {...props} />;
}

export default React.memo(React.forwardRef(TextEditor));

export type { EditorRef as TextEditorRef } from "./Editor";
