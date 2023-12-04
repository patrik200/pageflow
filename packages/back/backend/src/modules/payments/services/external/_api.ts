import { YooCheckout } from "@a2seven/yoo-checkout";
import { config } from "@app/core-config";

export const checkout = config._secrets.yookassa.secretKey
  ? new YooCheckout({
      shopId: config._secrets.yookassa.shopId,
      secretKey: config._secrets.yookassa.secretKey,
      debug: !config.productionEnv,
    })
  : null!;
