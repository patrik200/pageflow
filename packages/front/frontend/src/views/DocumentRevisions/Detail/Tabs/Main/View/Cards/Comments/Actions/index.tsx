import React from "react";
import { observer } from "mobx-react-lite";

import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

import CommentsShowUnresolvedAction from "./ShowUnresolved";

import { wrapperStyles } from "./style.css";

interface CommentsActionsInterface {
  filter: CommentsFilterEntity;
}

function CommentsActions({ filter }: CommentsActionsInterface) {
  return (
    <div className={wrapperStyles}>
      <CommentsShowUnresolvedAction filter={filter} />
    </div>
  );
}

export default observer(CommentsActions);
