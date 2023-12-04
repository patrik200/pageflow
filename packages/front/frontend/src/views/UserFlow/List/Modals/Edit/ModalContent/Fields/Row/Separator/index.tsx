import React from "react";
import { observer } from "mobx-react-lite";
import { UserFlowMode } from "@app/shared-enums";
import { useTranslation } from "@app/front-kit";
import { Typography } from "@app/ui-kit";

import { textStyles } from "./style.css";

interface UserFlowFieldsRowSeparatorInterface {
  mode: UserFlowMode;
}

function UserFlowFieldsRowSeparator({ mode }: UserFlowFieldsRowSeparatorInterface) {
  const { t } = useTranslation();
  return <Typography className={textStyles}>{t({ scope: "user_flow_modes", name: mode })}</Typography>;
}

export default observer(UserFlowFieldsRowSeparator);
