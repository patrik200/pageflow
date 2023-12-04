import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { nbspString } from "@worksolutions/utils";

interface DaysRemainingInterface {
  days: number;
}

function DaysRemaining({ days }: DaysRemainingInterface) {
  const { t } = useTranslation();
  if (days > 0)
    return <>{t({ scope: "time", name: "days_plus_remaining" }, { count: days }).replaceAll(" ", nbspString)}</>;
  if (days < 0)
    return <>{t({ scope: "time", name: "days_minus_remaining" }, { count: -days }).replaceAll(" ", nbspString)}</>;
  return <>{t({ scope: "time", name: "today" }).replaceAll(" ", nbspString)}</>;
}

export default observer(DaysRemaining);
