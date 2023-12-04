import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import Tag, { TagModeType } from "components/Tag";

import { descriptionStyles, wrapperStyles } from "./style.css";

interface TagInterface {
  alert?: boolean;
  textPreTag: string;
  textTag: string;
  tagModeType: TagModeType;
}

function InternalTag({ alert, textPreTag, textTag, tagModeType }: TagInterface) {
  return (
    <div className={wrapperStyles}>
      <Typography className={descriptionStyles}>{textPreTag}</Typography>
      <Tag alert={alert} text={textTag} mode={tagModeType} />
    </div>
  );
}

export default observer(InternalTag);
