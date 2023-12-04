import React from "react";
import { Icon, Typography } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { TicketPriorities } from "@app/shared-enums";
import cn from "classnames";

import { containerStyles, themeColorStyleVariants, titleStyles } from "./style.css";

interface PriorityInterface {
  priority: TicketPriorities;
}

function Priority({ priority }: PriorityInterface) {
  const { t } = useTranslation();

  const iconByPriority = React.useMemo(() => {
    if (priority === TicketPriorities.LOW) return "arrowDownSLine";
    if (priority === TicketPriorities.HIGH) return "arrowUpSLine";
    return "minusLine";
  }, [priority]);

  return (
    <div className={containerStyles}>
      <Icon className={themeColorStyleVariants[priority]} icon={iconByPriority} />
      <Typography className={cn(titleStyles, themeColorStyleVariants[priority])}>
        {t({ scope: "kanban", place: "ticket_priorities", name: priority })}
      </Typography>
    </div>
  );
}

export default React.memo(Priority);
