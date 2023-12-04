import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";

import { SubscriptionEntity } from "core/entities/subscription/subscription";
import { SubscriptionBuyEntity } from "core/entities/subscription/buy";
import { arrayOfPaymentEntitiesDecoder, PaymentEntity } from "core/entities/subscription/payment";

@Service()
export class SubscriptionStorage extends Storage {
  static token = "SubscriptionStorage";

  constructor() {
    super();
    this.initStorage(SubscriptionStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @observable subscription: SubscriptionEntity | null = null;
  @observable payments: PaymentEntity[] = [];

  @action loadSubscription = async () => {
    try {
      const [subscription, { array: payments }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/subscription",
          method: METHODS.GET,
          serverDataEntityDecoder: SubscriptionEntity,
        })(),
        await this.requestManager.createRequest({
          url: "/subscription/payments",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfPaymentEntitiesDecoder,
          responseDataFieldPath: ["list"],
        })(),
      ]);

      this.subscription = subscription;
      this.payments = payments;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action buySubscription = async () => {
    try {
      const result = await this.requestManager.createRequest({
        url: "/subscription/buy",
        method: METHODS.POST,
        serverDataEntityDecoder: SubscriptionBuyEntity,
      })();
      return { success: true, data: result } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action cancelSubscription = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/subscription/cancel",
        method: METHODS.POST,
      })();
      this.subscription?.cancel();
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
