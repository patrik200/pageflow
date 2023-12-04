import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import cn from "classnames";

import { tagTextStyles, tagTextStyleVariants, tagWrapperStyles, tagWrapperStyleVariants } from "./style.css";

interface ClientNotificationInterface {
  text: string;
  type: string;
}

function ClientNotification({ text, type }: ClientNotificationInterface) {
  return (
    <div
      className={cn(
        tagWrapperStyles,
        tagWrapperStyleVariants[type as keyof typeof tagWrapperStyleVariants] ?? tagWrapperStyleVariants.default,
      )}
    >
      <Typography
        className={cn(
          tagTextStyles,
          tagTextStyleVariants[type as keyof typeof tagTextStyleVariants] ?? tagTextStyleVariants.default,
        )}
      >
        {text}
      </Typography>
    </div>
  );
}

export default observer(ClientNotification);
