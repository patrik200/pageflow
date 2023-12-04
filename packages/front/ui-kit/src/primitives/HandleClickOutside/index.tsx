import React from "react";
import { useClickAway } from "react-use";
import { useProvideRef } from "@worksolutions/react-utils";

export type ClickOutsideIgnoreElement = HTMLElement | undefined | null;

export type ClickOutsideIgnoreElements = ClickOutsideIgnoreElement[];

export interface HandleClickOutsideInterface {
  enabled?: boolean;
  ignoreElements?: ClickOutsideIgnoreElements;
  children: React.JSX.Element;
  onClickOutside: () => void;
}

const emptyFunc = () => null;

function HandleClickOutside({ children, ignoreElements, enabled = true, onClickOutside }: HandleClickOutsideInterface) {
  const ref = React.useRef<HTMLElement>(null);
  const handleClickAway = React.useCallback(
    (event: Event) => {
      if (ignoreElements?.filter(Boolean).find((ignorableElement) => ignorableElement!.contains(event.target as any)))
        return;
      onClickOutside();
    },
    [ignoreElements, onClickOutside],
  );

  useClickAway(ref, enabled ? handleClickAway : emptyFunc);

  // @ts-ignore
  return React.cloneElement(children, { ref: useProvideRef(ref, children.ref) });
}

export default React.memo(HandleClickOutside);
