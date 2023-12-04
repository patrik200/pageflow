import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";

import Tag, { TagModeType } from "components/Tag";

import { tagStyles } from "./style.css";

interface CompletedTagInterface {
  className?: string;
  text: string;
  mode: TagModeType;
}

function CompletedTag({ className, text, mode }: CompletedTagInterface) {
  return <Tag className={cn(className, tagStyles)} text={text} mode={mode} />;
}

export default observer(CompletedTag);
