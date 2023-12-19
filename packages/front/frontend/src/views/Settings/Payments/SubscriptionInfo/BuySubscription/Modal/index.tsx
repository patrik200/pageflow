import React from "react";
import { observer } from "mobx-react-lite";
import { Modal, ModalTitle, Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { PaymentType } from "@app/shared-enums";
import { useAsyncFn, useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";

import { emitRequestError } from "core/emitRequest";

import { SubscriptionEntity } from "core/entities/subscription/subscription";

import { SubscriptionStorage } from "core/storages/subscription";

import SubscriptionPaymentType from "./PaymentType";

import { descriptionStyles, paymentMethodsWrapperStyles } from "./style.css";

interface BuySubscriptionModalInterface {
  opened: boolean;
  subscription: SubscriptionEntity;
  onClose: () => void;
}

function BuySubscriptionModal({ opened, subscription, onClose }: BuySubscriptionModalInterface) {
  const { t } = useTranslation("settings");

  const { buySubscription } = useViewContext().containerInstance.get(SubscriptionStorage);

  const [{ loading }, asyncBuySubscription] = useAsyncFn(buySubscription, [buySubscription]);
  const handleBuySubscription = React.useCallback(
    async (type: PaymentType) => {
      const result = await asyncBuySubscription({ paymentType: type });
      if (result.success) {
        document.location.href = result.data.confirmationUrl;
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t({ scope: "tab_payments", place: "subscription", name: "buy_modal", parameter: "unexpected_error_message" }),
      );
    },
    [asyncBuySubscription, t],
  );

  const handlePaymentTypeClickFabric = useMemoizeCallback(
    (type: PaymentType) => () => handleBuySubscription(type),
    [handleBuySubscription],
    identity,
  );

  const getDescription = React.useCallback(
    (type: PaymentType) => {
      if (type === PaymentType.SBP) {
        if (!subscription.autoPaymentsAvailable) return undefined;
        return t({
          scope: "tab_payments",
          place: "subscription",
          name: "buy_modal",
          parameter: "sbp_automatic_payments_warning",
        });
      }

      return undefined;
    },
    [subscription.autoPaymentsAvailable, t],
  );

  return (
    <Modal opened={opened} onClose={onClose}>
      <ModalTitle>
        {t({ scope: "tab_payments", place: "subscription", name: "buy_modal", parameter: "title" })}
      </ModalTitle>
      <Typography className={descriptionStyles}>
        {t(
          {
            scope: "tab_payments",
            place: "subscription",
            name: "buy_modal",
            parameter: subscription.autoPaymentsAvailable ? "description_auto_payments" : "description_one_time",
          },
          { price: subscription.pricePerMonth },
        )}
      </Typography>
      <div className={paymentMethodsWrapperStyles}>
        {Object.values(PaymentType).map(
          (type) =>
            availablePaymentTypes[type] && (
              <SubscriptionPaymentType
                key={type}
                disabled={loading}
                paymentType={type}
                description={getDescription(type)}
                onClick={handlePaymentTypeClickFabric(type)}
              />
            ),
        )}
      </div>
    </Modal>
  );
}

export default observer(BuySubscriptionModal);

const availablePaymentTypes: Record<PaymentType, boolean> = {
  [PaymentType.BANK_CARD]: true,
  [PaymentType.SBP]: false,
  [PaymentType.YOO_MONEY]: true,
};
