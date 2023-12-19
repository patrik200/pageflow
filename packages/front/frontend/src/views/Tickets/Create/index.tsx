import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";

import Card from "components/Card";
import Edit from "components/Tickets/TicketDetailModal/ModalContent/ContentModes/Edit";
import CardTitlePreset from "components/Card/pressets/CardTitle";
import GroupedContent from "components/FormField/GroupedContent";

import { emitRequestError } from "core/emitRequest";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { TicketsStorage } from "core/storages/ticket";

import PageWrapper from "../../_PageWrapper";

function CreateTicketView() {
  const { push, query } = useRouter();
  const { t } = useTranslation("ticket-detail");
  const { createTicket } = useViewContext().containerInstance.get(TicketsStorage);

  const entity = React.useMemo(() => EditTicketEntity.buildEmpty(query.board as string), [query.board]);

  const handleTicketCreate = React.useCallback(async () => {
    const result = await createTicket(entity);
    if (result.success) {
      if (query.project) {
        await push.current({
          pathname: "/projects/[projectId]",
          query: { board: query.board as string, projectId: query.project as string, tab: "tickets" },
        });
        return;
      }
      await push.current({ pathname: "/tickets", query: { board: query.board as string } });
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_ticket", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createTicket, entity, push, query.board, query.project, t]);

  const [{ loading }, asyncHandleTicketCreate] = useAsyncFn(handleTicketCreate, [handleTicketCreate]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleTicketCreate }),
    [asyncHandleTicketCreate, entity],
  );

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      {query.board && (
        <>
          <CardTitlePreset
            title={t({ scope: "meta", name: "create" })}
            actions={
              <Button size="SMALL" loading={loading} iconLeft="plusLine" onClick={handleCreateClick}>
                {t({ scope: "create_ticket", place: "actions", name: "create" })}
              </Button>
            }
          />
          <Card>
            <GroupedContent>
              <Edit entity={entity} />
            </GroupedContent>
          </Card>
        </>
      )}
    </PageWrapper>
  );
}

export default observer(CreateTicketView);
