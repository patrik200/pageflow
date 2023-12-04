import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EditorState } from "lexical";

interface OnChangePluginInterface {
  onChange: (html: string) => void;
}

function OnChangePlugin({ onChange }: OnChangePluginInterface) {
  const [editor] = useLexicalComposerContext();
  const handleChange = React.useCallback(
    (editorState: EditorState) => {
      editorState.read(() => onChange(sanitize($generateHtmlFromNodes(editor))));
    },
    [editor, onChange],
  );

  return <LexicalOnChangePlugin ignoreSelectionChange onChange={handleChange} />;
}

export default React.memo(OnChangePlugin);

function sanitize(html: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  dom.body.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      if (attribute.name === "src") return;
      if (attribute.name === "href") return;
      if (attribute.name === "target") return;
      node.removeAttribute(attribute.name);
    });
  });
  return dom.body.innerHTML;
}
