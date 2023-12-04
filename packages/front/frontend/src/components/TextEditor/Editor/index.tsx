import React from "react";
import { observer } from "mobx-react-lite";
import { TextFieldWrapper, TextFieldWrapperInterface } from "@app/ui-kit";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  HEADING,
  ORDERED_LIST,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  UNORDERED_LIST,
} from "@lexical/markdown";

import { EditableFileEntity } from "core/entities/file";

import ToolbarPlugin from "./plugins/Toolbar";
import PlaceholderPlugin from "./plugins/Placeholder";
import { lexicalTheme } from "./theme";
import { ImageNode } from "./plugins/CustomNodes/Image";
import DisabledPlugin from "./plugins/DisabledPlugin";
import OnChangePlugin from "./plugins/OnChangePlugin";
import InitialValuePlugin from "./plugins/InitialValuePlugin";
import EditorRefPlugin, { EditorRef } from "./plugins/EditorRefPlugin";

import { editableInputStyles, editorContainerStyles, editorStyles } from "./style.css";

export interface EditorComponentInterface extends Omit<TextFieldWrapperInterface, "children"> {
  innerRef?: React.Ref<EditorRef>;
  disabled?: boolean;
  placeholder?: string;
  initialHTML: string;
  onChange: (html: string) => void;
  onAddImage: (file: EditableFileEntity) => void;
}

function EditorComponent({
  innerRef,
  disabled,
  placeholder,
  initialHTML,
  onChange,
  onAddImage,
  ...props
}: EditorComponentInterface) {
  const initialConfig = React.useMemo<InitialConfigType>(
    () => ({
      namespace: "editor",
      theme: lexicalTheme,
      onError: console.error,
      nodes: [ListNode, ListItemNode, HeadingNode, LinkNode, QuoteNode, ImageNode],
    }),
    [],
  );

  return (
    <TextFieldWrapper {...props}>
      <div className={editorContainerStyles}>
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin onAddImage={onAddImage} />
          <div className={editorStyles}>
            <RichTextPlugin
              contentEditable={<ContentEditable className={editableInputStyles} />}
              placeholder={<PlaceholderPlugin placeholder={placeholder} />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={markdownShortcutTransformers} />
          <DisabledPlugin disabled={disabled} />
          <InitialValuePlugin initialHtml={initialHTML} />
          <EditorRefPlugin innerRef={innerRef} />
        </LexicalComposer>
      </div>
    </TextFieldWrapper>
  );
}

export default observer(EditorComponent);

const markdownShortcutTransformers = [
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
  HEADING,
  UNORDERED_LIST,
  ORDERED_LIST,
];

export type { EditorRef } from "./plugins/EditorRefPlugin";
