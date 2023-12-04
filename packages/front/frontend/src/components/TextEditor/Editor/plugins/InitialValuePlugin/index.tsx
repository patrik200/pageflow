import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

interface InitialValuePluginInterface {
  initialHtml: string;
}

function InitialValuePlugin({ initialHtml }: InitialValuePluginInterface) {
  const [initialHtmlState] = React.useState(initialHtml);
  const [editor] = useLexicalComposerContext();
  React.useEffect(
    () =>
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtmlState, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().select();
        $insertNodes(nodes);
      }),
    [editor, initialHtmlState],
  );

  return null;
}

export default React.memo(InitialValuePlugin);
