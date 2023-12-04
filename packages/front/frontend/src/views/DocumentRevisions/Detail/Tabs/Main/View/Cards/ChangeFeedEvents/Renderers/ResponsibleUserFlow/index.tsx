import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import { FormFieldTextEmptyView } from "components/FormField/Text";
import { BooleanRenderer, TextRenderer } from "components/ChangeFeed";

import { rowStyles } from "./style.css";

interface ResponsibleUserFlowRendererInterface {
  value: {
    name: string | null | undefined;
    rowsApproved: boolean | undefined;
    reviewerApproved: boolean | undefined;
    reviewerComment: string | null | undefined;
  } | null;
}

function ResponsibleUserFlowRenderer({ value }: ResponsibleUserFlowRendererInterface) {
  const { t } = useTranslation("document-revision-detail");
  const rowsApprovedOptions = React.useMemo(
    () => ({
      true: t({
        scope: "main_tab",
        place: "responsible_user_flow_field",
        name: "change_feed",
        parameter: "rows_approved_true",
      }),
      false: t({
        scope: "main_tab",
        place: "responsible_user_flow_field",
        name: "change_feed",
        parameter: "rows_approved_false",
      }),
    }),
    [t],
  );

  const reviewerApprovedOptions = React.useMemo(
    () => ({
      true: t({
        scope: "main_tab",
        place: "responsible_user_flow_field",
        name: "change_feed",
        parameter: "reviewer_approved_true",
      }),
      false: t({
        scope: "main_tab",
        place: "responsible_user_flow_field",
        name: "change_feed",
        parameter: "reviewer_approved_false",
      }),
    }),
    [t],
  );

  if (!value) return <FormFieldTextEmptyView />;

  return (
    <div className={rowStyles}>
      {value.name !== undefined && <TextRenderer value={value.name} />}
      {value.rowsApproved !== undefined && <BooleanRenderer value={value.rowsApproved} options={rowsApprovedOptions} />}
      {value.reviewerApproved !== undefined && (
        <BooleanRenderer value={value.reviewerApproved} options={reviewerApprovedOptions} />
      )}
      {value.reviewerComment !== undefined && (
        <TextRenderer
          value={
            value.reviewerComment
              ? t(
                  {
                    scope: "main_tab",
                    place: "responsible_user_flow_field",
                    name: "change_feed",
                    parameter: "reviewer_comment",
                  },
                  { comment: value.reviewerComment },
                )
              : null
          }
        />
      )}
    </div>
  );
}

export default observer(ResponsibleUserFlowRenderer);
