import React from "react";
import { observer } from "mobx-react-lite";

import InternalTag from "./InternalTag";

import { useDeadlineTexts } from "./hooks";

interface TagInterface {
  deadlineDate: Date | undefined;
  approvedDate: Date | undefined;
  deadlineDaysIncludeWeekends: boolean;
}

function DeadlineDateTag({ deadlineDate, approvedDate, deadlineDaysIncludeWeekends }: TagInterface) {
  const deadlineTexts = useDeadlineTexts(deadlineDate, approvedDate, deadlineDaysIncludeWeekends);

  if (!deadlineTexts) return null;

  return (
    <InternalTag
      alert={deadlineTexts.alert}
      textPreTag={deadlineTexts.text}
      tagModeType={deadlineTexts.tagMode}
      textTag={deadlineTexts.tagText}
    />
  );
}

export default observer(DeadlineDateTag);
