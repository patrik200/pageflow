import React from "react";
import { useFileSelector } from "@worksolutions/react-utils";
import { AcceptTypes, FileInterface } from "@worksolutions/utils";
import { $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { EditableFileEntity } from "core/entities/file";

import SimpleButton from "../../Elements/Button";
import { $createImageNode } from "../../../CustomNodes/Image";

const acceptTypes: AcceptTypes[] = [AcceptTypes.IMAGE];

interface ToolbarImageInterface {
  onAdd: (entity: EditableFileEntity) => void;
}

function ToolbarImage({ onAdd }: ToolbarImageInterface) {
  const [editor] = useLexicalComposerContext();
  const handleSelect = React.useCallback(
    (file: FileInterface) => {
      editor.update(() => {
        const entity = EditableFileEntity.build(file);
        onAdd(entity);
        const imageNode = $createImageNode({ src: entity.url });
        $insertNodes([imageNode]);
      });
    },
    [editor, onAdd],
  );

  const { openNativeFileDialog } = useFileSelector(handleSelect, { multiply: false, acceptTypes });
  return <SimpleButton icon="editorImage2Line" onClick={openNativeFileDialog} />;
}

export default React.memo(ToolbarImage);
