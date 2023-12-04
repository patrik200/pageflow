import { Injectable } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetClientNotificationsService {
  private getSubscriptionActive() {
    const currentUser = getCurrentUser();
    if (currentUser.clientSubscriptionActive) return null;

    if (currentUser.role === UserRole.ADMIN)
      return {
        text: `Подписка не акивна. Доступ только на чтение. \
Продлить подписку можно на странице настроек, во вкладке платежей.`,
        type: "warning",
      };

    return { text: `Подписка не акивна. Доступ только на чтение`, type: "warning" };
  }

  private getClientReadOnlyMode() {
    const currentUser = getCurrentUser();
    if (!currentUser.clientReadOnlyMode) return null;

    return {
      text: `\
Включен режим только на чтение на время проведения технического обслуживания. \
Отключение этого режима произойдет автоматически. Приносим извинения за неудобства.`,
      type: "warning",
    };
  }

  async getCurrentClientNotifications() {
    const notifications: { text: string; type: string }[] = [];

    const subscriptionActive = this.getSubscriptionActive();
    if (subscriptionActive) notifications.push(subscriptionActive);

    const readOnlyMode = this.getClientReadOnlyMode();
    if (readOnlyMode) notifications.push(readOnlyMode);

    return notifications;
  }
}
