import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Spinner } from "@app/ui-kit";

import { SubscriptionStorage } from "core/storages/subscription";

import SubscriptionInfo from "./SubscriptionInfo";
import PaymentsInfo from "./PaymentsInfo";

import { spinnerStyles, wrapperStyles } from "./style.css";

function SettingsPaymentsView() {
  const { subscription, loadSubscription } = useViewContext().containerInstance.get(SubscriptionStorage);

  const [{ loading }, asyncLoadSubscription] = useAsyncFn(loadSubscription, [loadSubscription], { loading: true });
  React.useEffect(() => void asyncLoadSubscription(), [asyncLoadSubscription]);

  if (loading) return <Spinner className={spinnerStyles} />;

  if (!subscription) return null;

  return (
    <div className={wrapperStyles}>
      <SubscriptionInfo subscription={subscription} />
      <PaymentsInfo />
    </div>
  );
}

export default observer(SettingsPaymentsView);
