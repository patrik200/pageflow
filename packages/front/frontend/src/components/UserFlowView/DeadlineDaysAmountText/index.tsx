import React from "react";
import { observer } from "mobx-react-lite";
import { isNil, nbspString } from "@worksolutions/utils";
import { useTranslation } from "@app/front-kit";
import { Typography } from "@app/ui-kit";

import { deadlineDaysAmountStyles } from "./style.css";

interface DeadlineDaysAmountTextInterface {
  deadlineDaysIncludeWeekends: boolean;
  deadlineDaysAmount: number | null | undefined;
}

function DeadlineDaysAmountText({ deadlineDaysAmount, deadlineDaysIncludeWeekends }: DeadlineDaysAmountTextInterface) {
  const { t } = useTranslation("user-flow");

  const deadlineDaysAmountString = React.useMemo(() => {
    if (isNil(deadlineDaysAmount)) return null;
    let result = "";
    result += t({ scope: "user_flow_card", place: "deadline_days_display", name: "deadline_text" });
    result += ":" + nbspString;
    result += t({ scope: "common:time", name: "days" }, { count: deadlineDaysAmount });
    result += "." + nbspString;
    result += t({
      scope: "user_flow_card",
      place: "deadline_days_display",
      name: deadlineDaysIncludeWeekends ? "include_weekends" : "exclude_weekends",
    });
    return result;
  }, [deadlineDaysAmount, deadlineDaysIncludeWeekends, t]);

  if (!deadlineDaysAmountString) return null;

  return <Typography className={deadlineDaysAmountStyles}>{deadlineDaysAmountString}</Typography>;
}

export default observer(DeadlineDaysAmountText);
