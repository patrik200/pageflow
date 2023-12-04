import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { DateMode, nbspString } from "@worksolutions/utils";
import { DateTime } from "luxon";
import cn from "classnames";
import { Icon } from "@app/ui-kit";
import { DocumentRevisionApprovingStatuses } from "@app/shared-enums";

import Card from "components/Card";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldUser from "components/FormField/User";
import FormFieldDate from "components/FormField/Date";
import FormFieldAttachments from "components/FormField/Attachments";
import FormFieldText, { FormFieldTextEmptyView } from "components/FormField/Text";
import CardTitle from "components/Card/pressets/CardTitle";
import DaysRemaining from "components/DaysRemaining";

import { DocumentRevisionDetailEntity } from "core/entities/documentRevision/revisionDetail";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";
import { DocumentRevisionsStorage } from "core/storages/document/revisions";

import InfoCardUserFlow from "./UserFlow";

import { additionalCardStyleVariants, cardStyles, mainCardStyles, wrapperStyles } from "./style.css";

function InfoCard() {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();
  const revision = containerInstance.get(DocumentRevisionsStorage).revisionDetail!;
  const { documentRevisionReturnCodeDictionary } = containerInstance.get(DictionariesCommonStorage);

  const viewReturnCounts = React.useMemo(
    () =>
      DocumentRevisionDetailEntity.getViewReturnCounts(
        documentRevisionReturnCodeDictionary.values,
        revision.returnCounts,
      ),
    [documentRevisionReturnCodeDictionary.values, revision.returnCounts],
  );

  const viewTimeInStatus = React.useMemo(() => {
    if (!DocumentRevisionApprovingStatuses.includes(revision.status)) return undefined;
    return Math.ceil(Math.abs(DateTime.fromJSDate(revision.statusChangeDate).diffNow("days").days)).toString();
  }, [revision.status, revision.statusChangeDate]);

  const viewApproveComments = React.useMemo(() => {
    const comments: string[] = [];

    if (revision.responsibleUser?.comment)
      comments.push(`\
${revision.responsibleUser.user.name}:${nbspString}\
${revision.responsibleUser.comment}`);

    if (revision.responsibleUserFlow?.reviewer?.comment)
      comments.push(
        `\
${revision.responsibleUserFlow.reviewer.user.name}:${nbspString}\
${revision.responsibleUserFlow.reviewer.comment}`,
      );

    if (comments.length === 0) return null;

    return comments.map((comment, index) => `${index + 1}.${nbspString}${comment}`).join("\n");
  }, [revision.responsibleUser, revision.responsibleUserFlow]);

  return (
    <div className={wrapperStyles}>
      <Card className={cn(cardStyles, mainCardStyles)}>
        <GroupedContent>
          <FormFieldText
            view
            title={t({ scope: "main_tab", place: "status_field", name: "placeholder" })}
            value={`\
${t({ scope: "common:document_revision_statuses", name: revision.status })}\
${revision.approvedDateString === null ? "" : ` (${revision.approvedDateString})`}`}
          />
          {revision.reviewRequestedCount !== 0 && (
            <FormFieldText
              view
              title={t({ scope: "main_tab", place: "review_count_field", name: "placeholder" })}
              value={revision.reviewRequestedCount.toString()}
            />
          )}
          {viewTimeInStatus && (
            <FormFieldText
              view
              title={t({ scope: "main_tab", place: "status_time_field", name: "placeholder" })}
              value={viewTimeInStatus}
            />
          )}
          {revision.statusChangeAuthor && (
            <FormFieldUser
              title={t({ scope: "main_tab", place: "status_author_field", name: "placeholder" })}
              value={revision.statusChangeAuthor}
            />
          )}
          <FormFieldUser
            title={t({ scope: "main_tab", place: "responsible_user_field", name: "placeholder" })}
            value={revision.responsibleUser?.user ?? null}
            checked={revision.responsibleUserApproving?.approved}
          />
          {viewApproveComments && (
            <FormFieldText
              view
              title={t({ scope: "main_tab", place: "approve_comments_field", name: "placeholder" })}
              value={viewApproveComments}
            />
          )}
          {viewReturnCounts && (
            <FormFieldText
              view
              title={t({ scope: "main_tab", place: "return_code_field", name: "placeholder" })}
              value={viewReturnCounts}
            />
          )}
          {revision.returnMessage && (
            <FormFieldText
              view
              title={t({ scope: "main_tab", place: "return_message_field", name: "placeholder" })}
              value={revision.returnMessage}
            />
          )}
          <FormFieldDate
            view
            title={t({ scope: "main_tab", place: "approving_deadline_field", name: "placeholder" })}
            value={revision.approvingDeadline}
            postValue={
              revision.approvingDeadlineRemainingDays === null ? undefined : (
                <>
                  {nbspString}
                  (<DaysRemaining days={revision.approvingDeadlineRemainingDays} />)
                </>
              )
            }
            dateMode={DateMode.DATE_WITH_STRING_MONTH}
          />
          <FormFieldText
            view
            title={t({ scope: "main_tab", place: "can_prolong_approving_deadline_field", name: "placeholder" })}
            value={t({
              scope: "main_tab",
              place: "can_prolong_approving_deadline_field",
              name: "values",
              parameter: revision.canProlongApprovingDeadline ? "yes" : "no",
            })}
          />
          <FormFieldUser
            title={t({ scope: "main_tab", place: "author_field", name: "placeholder" })}
            value={revision.author}
          />
          <FormFieldAttachments
            view
            title={t({ scope: "main_tab", place: "attachments_field", name: "placeholder" })}
            value={revision.files}
          />
          <FormFieldDate
            view
            title={t({ scope: "main_tab", place: "created_at_field", name: "placeholder" })}
            value={revision.createdAt}
            dateMode={DateMode.DATE_WITH_STRING_MONTH}
          />
          <FormFieldDate
            view
            title={t({ scope: "main_tab", place: "updated_at_field", name: "placeholder" })}
            value={revision.updatedAt}
            dateMode={DateMode.DATE_WITH_STRING_MONTH}
          />
        </GroupedContent>
      </Card>
      <CardTitle
        className={cn(
          cardStyles,
          revision.responsibleUserFlow ? additionalCardStyleVariants.enabled : additionalCardStyleVariants.disabled,
        )}
        title={t({ scope: "main_tab", place: "responsible_user_flow_field", name: "placeholder" })}
        size="medium"
        actions={(revision.responsibleUserFlow?.allRowsCompleted ?? false) && <Icon icon="checkboxCircleFill" />}
      >
        {revision.responsibleUserFlow ? (
          <InfoCardUserFlow entity={revision.responsibleUserFlow} />
        ) : (
          <FormFieldTextEmptyView />
        )}
      </CardTitle>
    </div>
  );
}

export default observer(InfoCard);
