import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { ClientCommonStorage } from "core/storages/client/client-common";

import ClientNotification from "./Notification";

import { notificationsWrapperStyles } from "./style.css";

function ClientNotifications() {
  const { client } = useViewContext().containerInstance.get(ClientCommonStorage);
  if (!client.notifications) return null;
  if (client.notifications.length === 0) return null;

  return (
    <div className={notificationsWrapperStyles}>
      {client.notifications.map((notification, key) => (
        <ClientNotification key={key} text={notification.text} type={notification.type} />
      ))}
    </div>
  );
}

export default observer(ClientNotifications);
