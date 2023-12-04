import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { SubscriptionEntity } from "core/entities/subscription/subscription";

import { SubscriptionStorage } from "core/storages/subscription";

import { buttonStyles } from "./style.css";

interface BuySubscriptionInterface {
  subscription: SubscriptionEntity;
}

function BuySubscription({ subscription }: BuySubscriptionInterface) {
  const { t } = useTranslation("settings");

  const { buySubscription } = useViewContext().containerInstance.get(SubscriptionStorage);

  const [{ loading }, asyncBuySubscription] = useAsyncFn(buySubscription, [buySubscription]);
  const handleBuySubscription = React.useCallback(async () => {
    const result = await asyncBuySubscription();
    if (result.success) {
      document.location.href = result.data.confirmationUrl;
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_payments", place: "subscription", name: "buy", parameter: "unexpected_error_message" }),
    );
  }, [asyncBuySubscription, t]);

  const handleButtonClick = React.useCallback(() => handleBuySubscription(), [handleBuySubscription]);

  if (subscription.autoRenew) return null;

  return (
    <Button className={buttonStyles} loading={loading} size="SMALL" onClick={handleButtonClick}>
      {t(
        { scope: "tab_payments", place: "subscription", name: "buy", parameter: "button" },
        { price: subscription.pricePerMonth },
      )}
    </Button>
  );
}

export default observer(BuySubscription);
