import React from "react";
import { useCopyToClipboard } from "react-use";
import { useBoolean, useEffectSkipFirst } from "@worksolutions/react-utils";
import cn from "classnames";

import { PopupManagerMode, PopupManagerModifierOffset } from "primitives/PopupManager";
import { handleTriggerElementEventsForHover } from "primitives/PopupManager/PopupManagers/Hover/libs";
import { handleTriggerElementEventsForClick } from "primitives/PopupManager/PopupManagers/Click/libs";
import Tooltip, { TooltipInterface } from "primitives/Tooltip";
import Typography from "primitives/Typography";

import { childrenStyles, hiddenTooltipPopupStyles, tooltipTextStyles } from "./style.css";

type CopyToClipboardInterface = {
  value: string;
  children: React.JSX.Element;
  tooltipCopyText: string;
  tooltipCopiedText: string;
} & Pick<TooltipInterface, "offset" | "primaryPlacement" | "strategy">;

function CopyToClipboard({
  value,
  tooltipCopyText,
  tooltipCopiedText,
  children,
  primaryPlacement = "bottom-start",
  offset = defaultOffset,
  ...props
}: CopyToClipboardInterface) {
  const [ref, setRef] = React.useState<HTMLElement | null>(null);

  const [hovered, enableHover, disableHover] = useBoolean(false);
  const [copied, enableCopied, disableCopied] = useBoolean(false);

  const [, copyToClipboard] = useCopyToClipboard();

  useEffectSkipFirst(() => {
    disableHover();
    disableCopied();
  }, [disableCopied, disableHover, ref]);

  React.useEffect(() => {
    if (!ref) return;

    const disposeHover = handleTriggerElementEventsForHover(
      { popupHTMLNode: null, triggerHTMLNode: ref },
      { hideDelay: 0, showDelay: 100 },
      { show: enableHover, hide: disableHover },
    );

    let disableCopiedTimer: NodeJS.Timer | undefined;
    const disposeClick = handleTriggerElementEventsForClick(ref, false, {
      toggle: null!,
      show: () => {
        copyToClipboard(value);
        enableCopied();
        disableCopiedTimer = setTimeout(disableCopied, 3000);
      },
    });

    return () => {
      disposeHover();
      disposeClick();
      clearTimeout(disableCopiedTimer);
    };
  }, [copyToClipboard, disableCopied, disableHover, enableCopied, enableHover, ref, value]);

  const opened = hovered || copied;

  return (
    <Tooltip
      ref={setRef}
      tooltipPopupClassName={cn(!opened && hiddenTooltipPopupStyles)}
      opened={opened}
      mode={PopupManagerMode.EXTERNAL}
      popupElement={
        <Typography className={tooltipTextStyles}>{copied ? tooltipCopiedText : tooltipCopyText}</Typography>
      }
      triggerElement={React.cloneElement(children, {
        className: cn(children.props.className, childrenStyles),
      })}
      primaryPlacement={primaryPlacement}
      offset={offset}
      {...props}
    />
  );
}

const defaultOffset: PopupManagerModifierOffset = [0, 10];

export default React.memo(CopyToClipboard);
