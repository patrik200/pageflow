import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { SubscriptionEntity } from "core/entities/subscription/subscription";

import { SubscriptionStorage } from "core/storages/subscription";

import { buttonStyles } from "./style.css";

interface CancelSubscriptionInterface {
  subscription: SubscriptionEntity;
}

function CancelSubscription({ subscription }: CancelSubscriptionInterface) {
  const { t } = useTranslation("settings");
  const { cancelSubscription } = useViewContext().containerInstance.get(SubscriptionStorage);

  const [{ loading }, asyncCancelSubscription] = useAsyncFn(cancelSubscription, [cancelSubscription]);

  const handleCancelSubscription = React.useCallback(async () => {
    const result = await asyncCancelSubscription();
    if (result.success) {
      emitRequestSuccess(
        t({ scope: "tab_payments", place: "subscription", name: "cancel", parameter: "success_message" }),
      );
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_payments", place: "subscription", name: "cancel", parameter: "unexpected_error_message" }),
    );
  }, [asyncCancelSubscription, t]);

  const handleButtonClick = React.useCallback(() => handleCancelSubscription(), [handleCancelSubscription]);

  if (!subscription.autoRenew) return null;

  return (
    <>
      <Button className={buttonStyles} loading={loading} size="SMALL" onClick={handleButtonClick}>
        {t({ scope: "tab_payments", place: "subscription", name: "cancel", parameter: "button" })}
      </Button>
    </>
  );
}

export default observer(CancelSubscription);
