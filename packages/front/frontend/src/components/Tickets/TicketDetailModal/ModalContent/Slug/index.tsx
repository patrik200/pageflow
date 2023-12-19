import React from "react";
import { observer } from "mobx-react-lite";
import { CopyToClipboard } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import Tag from "components/Tag";

import { TicketEntity } from "core/entities/ticket/ticket";

interface TicketSlugInterface {
  className?: string;
  ticket: TicketEntity;
}

function TicketSlug({ className, ticket }: TicketSlugInterface) {
  const { t } = useTranslation("ticket-detail");
  return (
    <CopyToClipboard
      value={ticket.fullName}
      tooltipCopyText={t({ scope: "ticket_title", place: "copy_to_clipboard", name: "copy_text" })}
      tooltipCopiedText={t({ scope: "ticket_title", place: "copy_to_clipboard", name: "copied_text" })}
    >
      <Tag className={className} text={ticket.slug} mode="info" icon="fileCopyLine" />
    </CopyToClipboard>
  );
}

export default observer(TicketSlug);
