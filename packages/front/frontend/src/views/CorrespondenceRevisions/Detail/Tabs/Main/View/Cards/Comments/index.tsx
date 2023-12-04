import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";

import { CorrespondenceRevisionCommentsStorage } from "core/storages/correspondence/revisionComments";

import LoadingState from "./LoadingState";
import CommentsState from "./CommentsState";

function CommentsCard() {
  const { t } = useTranslation("correspondence-revision-detail");

  const { loadComments } = useViewContext().containerInstance.get(CorrespondenceRevisionCommentsStorage);
  const [{ loading }, asyncLoadComments] = useAsyncFn(loadComments, [loadComments], { loading: true });
  React.useEffect(() => void asyncLoadComments(), [asyncLoadComments]);

  return (
    <Card>
      <GroupedContent title={t({ scope: "main_tab", place: "comments", name: "title" })}>
        {loading ? <LoadingState /> : <CommentsState />}
      </GroupedContent>
    </Card>
  );
}

export default observer(CommentsCard);
