import React from "react";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link, LinkUrl } from "components/Link";

interface CreateTicketActionInterface {
  projectId?: string;
  boardId: string;
}

function CreateTicketAction({ boardId, projectId }: CreateTicketActionInterface) {
  const { t } = useTranslation("tickets");

  const href = React.useMemo<LinkUrl>(
    () => ({
      pathname: `/tickets/create`,
      query: Object.assign({ board: boardId }, projectId ? { project: projectId } : {}),
    }),
    [boardId, projectId],
  );

  return (
    <Link href={href}>
      <Button size="SMALL" iconLeft="plusLine" preventDefault={false}>
        {t({ scope: "actions", place: "create_ticket", name: "button" })}
      </Button>
    </Link>
  );
}

export default React.memo(CreateTicketAction);
