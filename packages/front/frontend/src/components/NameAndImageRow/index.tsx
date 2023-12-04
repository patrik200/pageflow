import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import cn from "classnames";

import UnavailableUntilUserTooltip from "components/UnavailableUserTooltip";

import { FileEntity } from "core/entities/file";

import NameAndImageRowAvatar from "./Avatar";

import {
  nameWithUnavailableIconStyles,
  nameDotsStyles,
  nameStyles,
  positionDotsStyles,
  positionStyles,
  titleWrapperDotsStyles,
  titleWrapperStyles,
  wrapperStyles,
} from "./style.css";

interface NameAndImageRowInterface {
  className?: string;
  dots?: boolean;
  name: string;
  position?: string;
  image?: FileEntity | null;
  unavailableUntil?: Date | null;
}

function NameAndImageRow({ className, dots, name, position, image, unavailableUntil }: NameAndImageRowInterface) {
  return (
    <div className={cn(wrapperStyles, className)}>
      <NameAndImageRowAvatar name={name} image={image} />
      <div className={cn(titleWrapperStyles, dots && titleWrapperDotsStyles)}>
        <div className={nameWithUnavailableIconStyles}>
          <Typography className={cn(nameStyles, dots && nameDotsStyles)}>{name}</Typography>
          {unavailableUntil && <UnavailableUntilUserTooltip userUnavailableUntil={unavailableUntil} />}
        </div>
        {position && <Typography className={cn(positionStyles, dots && positionDotsStyles)}>{position}</Typography>}
      </div>
    </div>
  );
}

export default observer(NameAndImageRow);
