import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { SubscriptionEntity } from "core/entities/subscription/subscription";

import BuySubscriptionModal from "./Modal";

import { buttonStyles } from "./style.css";

interface BuySubscriptionInterface {
  subscription: SubscriptionEntity;
}

function BuySubscription({ subscription }: BuySubscriptionInterface) {
  const { t } = useTranslation("settings");

  const [opened, open, close] = useBoolean(false);

  if (subscription.autoRenew) return null;

  return (
    <>
      <Button className={buttonStyles} size="SMALL" onClick={open}>
        {t(
          {
            scope: "tab_payments",
            place: "subscription",
            name: "buy",
            parameter: subscription.autoPaymentsAvailable ? "button_auto_payments" : "button_one_time",
          },
          { price: subscription.pricePerMonth },
        )}
      </Button>
      <BuySubscriptionModal opened={opened} subscription={subscription} onClose={close} />
    </>
  );
}

export default observer(BuySubscription);
