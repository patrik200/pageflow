import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import FormFieldWrapper from "components/FormField/Wrapper";

import { TicketCommentsStorage } from "core/storages/ticket/comments";

import LoadingState from "./LoadingState";
import CommentsState from "./CommentsState";

function CommentsCard() {
  const { t } = useTranslation("ticket-detail");

  const { loadComments } = useViewContext().containerInstance.get(TicketCommentsStorage);
  const [{ loading }, asyncLoadComments] = useAsyncFn(loadComments, [loadComments], { loading: true });
  React.useEffect(() => void asyncLoadComments(), [asyncLoadComments]);

  return (
    <FormFieldWrapper title={t({ scope: "main_tab", place: "comments_field", name: "title" })} mode="edit">
      {loading ? <LoadingState /> : <CommentsState />}
    </FormFieldWrapper>
  );
}

export default observer(CommentsCard);
