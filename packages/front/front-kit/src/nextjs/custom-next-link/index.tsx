import React from "react";
import Link, { LinkProps } from "next/link";

export type CustomLinkInterface = Omit<LinkProps, "as" | "prefetch" | "legacyBehavior" | "onMouseEnter" | "onClick"> & {
  download?: string;
  className?: string;
  asLink?: LinkProps["as"];
  enableNextClickDefaultBehavior?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

function CustomLinkComponent(
  {
    asLink,
    href,
    passHref = true,
    replace,
    scroll,
    shallow,
    locale,
    enableNextClickDefaultBehavior = false,
    onClick,
    ...props
  }: CustomLinkInterface,
  ref: React.Ref<HTMLAnchorElement>,
) {
  const resultOnClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (!enableNextClickDefaultBehavior) event.defaultPrevented = true;
      onClick?.(event);
    },
    [enableNextClickDefaultBehavior, onClick],
  );

  return (
    <Link
      href={href}
      passHref={passHref}
      as={asLink}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={false}
      locale={locale}
      legacyBehavior
    >
      <CustomNativeLink ref={ref} {...props} onClick={resultOnClick} />
    </Link>
  );
}

export const CustomLink = React.forwardRef(CustomLinkComponent);

const CustomNativeLink = React.forwardRef(
  (props: React.JSX.IntrinsicElements["a"], ref: React.Ref<HTMLAnchorElement>) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a ref={ref} {...props} onMouseEnter={undefined} />
  ),
);
