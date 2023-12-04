import React from "react";

import { EditableFileEntity } from "core/entities/file";

import ToolbarTextType from "./Actions/TextType";
import ToolbarBold from "./Actions/Bold";
import ToolbarItalic from "./Actions/Italic";
import ToolbarUnderline from "./Actions/Underline";
import ToolbarStrikethrough from "./Actions/Strikethrough";
import ToolbarCodeView from "./Actions/CodeView";
import ToolbarLink from "./Actions/Link";
import ToolbarImage from "./Actions/Image";
import ToolbarListOrdered from "./Actions/ListOrdered";
import ToolbarListUnordered from "./Actions/ListUnordered";

import { dividerStyles, groupStyles, toolbarStyles } from "./style.css";

interface ToolbarPluginInterface {
  onAddImage: (entity: EditableFileEntity) => void;
}

function ToolbarPlugin({ onAddImage }: ToolbarPluginInterface) {
  return (
    <div className={toolbarStyles}>
      <div className={groupStyles}>
        <ToolbarTextType />
      </div>
      <div className={dividerStyles} />
      <div className={groupStyles}>
        <ToolbarBold />
        <ToolbarItalic />
        <ToolbarUnderline />
        <ToolbarStrikethrough />
      </div>
      <div className={dividerStyles} />
      <div className={groupStyles}>
        <ToolbarCodeView />
        <ToolbarLink />
        <ToolbarImage onAdd={onAddImage} />
      </div>
      <div className={dividerStyles} />
      <div className={groupStyles}>
        <ToolbarListOrdered />
        <ToolbarListUnordered />
      </div>
    </div>
  );
}

export default React.memo(ToolbarPlugin);
