import React from "react";
import { observer } from "mobx-react-lite";

import { ChangeFeedEventEntity } from "core/entities/change-feed";

import ChangeFeedEventUpdated, { ChangeFeedEventUpdateRenderers } from "./Presets/Updated";
import ChangeFeedEventCreated from "./Presets/Created";
import ChangeFeedEventTemplate from "./Template";

interface ChangeFeedEventInterface {
  event: ChangeFeedEventEntity;
  createdTitle: string;
  updateRenders: ChangeFeedEventUpdateRenderers;
}

function ChangeFeedEvent({ event, updateRenders, createdTitle }: ChangeFeedEventInterface) {
  if (event.eventType === "created")
    return (
      <ChangeFeedEventTemplate event={event}>
        <ChangeFeedEventCreated title={createdTitle} event={event} />
      </ChangeFeedEventTemplate>
    );
  if (event.eventType === "updated")
    return (
      <ChangeFeedEventTemplate event={event}>
        <ChangeFeedEventUpdated event={event} renderers={updateRenders} />
      </ChangeFeedEventTemplate>
    );
  return null;
}

export default observer(ChangeFeedEvent);

export type { ChangeFeedEventUpdatedRenderer, ChangeFeedEventUpdateRenderers } from "./Presets/Updated";
export { default as BooleanRenderer } from "./Presets/Updated/Renderers/Boolean";
export { default as UserRenderer } from "./Presets/Updated/Renderers/User";
export { default as EnumRenderer } from "./Presets/Updated/Renderers/Enum";
export { default as TextRenderer } from "./Presets/Updated/Renderers/Text";
export { default as DateRenderer } from "./Presets/Updated/Renderers/Date";
export { default as DictionaryRenderer } from "./Presets/Updated/Renderers/Dictionary";
export { default as FilesRenderer } from "./Presets/Updated/Renderers/Files";
export { default as PermissionRenderer } from "./Presets/Updated/Renderers/Permission";
