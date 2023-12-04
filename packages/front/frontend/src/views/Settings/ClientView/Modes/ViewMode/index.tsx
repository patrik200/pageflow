import React from "react";
import { Button } from "@app/ui-kit";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useTranslation, useViewContext } from "@app/front-kit";

import Divider from "components/Divider";
import FormFieldText from "components/FormField/Text";
import GroupedContent from "components/FormField/GroupedContent";

import { globalEventBus } from "core/eventBus";

import { ClientCommonStorage } from "core/storages/client/client-common";

import FormFieldStorage from "./StorageField";

import { actionsWrapperStyles } from "./style.css";

interface ViewModeInterface {
  enableEditMode: () => void;
}

function ViewMode({ enableEditMode }: ViewModeInterface) {
  const { t } = useTranslation("settings");
  const { client, recreateElasticIndexes } = useViewContext().containerInstance.get(ClientCommonStorage);

  const handleElasticIndexesRecreate = React.useCallback(async () => {
    const result = await recreateElasticIndexes();
    if (!result.success) {
      globalEventBus.emit("NOTIFICATION_ERROR", {
        message: t({ scope: "tab_client", place: "edit", name: "error_messages", parameter: "elastic_update" }),
      });
      return;
    }
    globalEventBus.emit("NOTIFICATION_SUCCESS", {
      message: t({ scope: "tab_client", place: "edit", name: "elastic_success_message" }),
    });
  }, [recreateElasticIndexes, t]);

  const [{ loading }, asyncRecreateElasticIndexes] = useAsyncFn(handleElasticIndexesRecreate, [
    handleElasticIndexesRecreate,
  ]);

  return (
    <>
      <GroupedContent>
        <FormFieldText
          view
          direction="column"
          title={t({ scope: "tab_client", place: "name_field", name: "title" })}
          value={client.name}
        />
        {client.storage && (
          <FormFieldStorage
            direction="column"
            title={t({ scope: "tab_client", place: "storage_field", name: "title" })}
            storage={client.storage}
          />
        )}
      </GroupedContent>
      <Divider />
      <div className={actionsWrapperStyles}>
        <Button disabled={loading} onClick={enableEditMode}>
          {t({ scope: "tab_client", place: "edit", name: "actions", parameter: "edit" })}
        </Button>
        <Button type="OUTLINE" loading={loading} onClick={asyncRecreateElasticIndexes}>
          {t({ scope: "tab_client", place: "edit", name: "actions", parameter: "recreate_elastic" })}
        </Button>
      </div>
    </>
  );
}

export default observer(ViewMode);
