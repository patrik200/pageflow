import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";

import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

import CommentsState from "./CommentsState";
import CommentsActions from "./Actions";

function CommentsCard() {
  const { t } = useTranslation("document-revision-detail");

  const { containerInstance } = useViewContext();

  const { loadComments, loadDiscussionsForAllComments } = containerInstance.get(DocumentRevisionCommentsStorage);

  const filter = React.useMemo(() => CommentsFilterEntity.buildEmpty(), []);

  const handleLoad = React.useCallback(async () => {
    const comments = await loadComments(filter);
    if (!comments.success) return;
    void loadDiscussionsForAllComments();
  }, [loadComments, loadDiscussionsForAllComments, filter]);

  React.useEffect(() => {
    void handleLoad();
    return filter.subscribeOnChange(() => void handleLoad());
  }, [handleLoad, filter]);

  return (
    <Card>
      <GroupedContent
        size="extra"
        title={t({ scope: "main_tab", place: "comments", name: "title" })}
        actions={<CommentsActions filter={filter} />}
      >
        <CommentsState filter={filter} />
      </GroupedContent>
    </Card>
  );
}

export default observer(CommentsCard);
