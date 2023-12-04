import { createTypographyLinkComponent } from "@app/ui-kit";
import { CustomLink, CustomLinkInterface } from "@app/front-kit";
import { LinkProps } from "next/link";

export type LinkUrl = LinkProps["href"];

export const Link = createTypographyLinkComponent<CustomLinkInterface>(({ href, passHref = true, ...props }, ref) => {
  return <CustomLink ref={ref} href={href || "#"} passHref={passHref} {...props} />;
});
