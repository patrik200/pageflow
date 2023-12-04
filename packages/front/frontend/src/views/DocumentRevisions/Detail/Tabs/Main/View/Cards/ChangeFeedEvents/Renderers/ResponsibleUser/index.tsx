import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import { FormFieldTextEmptyView } from "components/FormField/Text";
import { BooleanRenderer, TextRenderer, UserRenderer } from "components/ChangeFeed";

import { rowStyles } from "./style.css";

interface ResponsibleUserRendererInterface {
  value: { user: string | null | undefined; comment: string | null | undefined; approved: boolean | undefined } | null;
}

function ResponsibleUserRenderer({ value }: ResponsibleUserRendererInterface) {
  const { t } = useTranslation("document-revision-detail");
  const approvedOptions = React.useMemo(
    () => ({
      true: t({
        scope: "main_tab",
        place: "responsible_user_field",
        name: "change_feed",
        parameter: "approved_true",
      }),
      false: t({
        scope: "main_tab",
        place: "responsible_user_field",
        name: "change_feed",
        parameter: "approved_false",
      }),
    }),
    [t],
  );

  if (!value) return <FormFieldTextEmptyView />;

  return (
    <div className={rowStyles}>
      {value.user !== undefined && <UserRenderer value={value.user} />}
      {value.approved !== undefined && <BooleanRenderer value={value.approved} options={approvedOptions} />}
      {value.comment !== undefined && (
        <TextRenderer
          value={
            value.comment
              ? t(
                  { scope: "main_tab", place: "responsible_user_field", name: "change_feed", parameter: "comment" },
                  { comment: value.comment },
                )
              : null
          }
        />
      )}
    </div>
  );
}

export default observer(ResponsibleUserRenderer);
