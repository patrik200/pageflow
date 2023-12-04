import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import cn from "classnames";

import { Link } from "components/Link";

import { ProfileStorage } from "core/storages/profile/profile";

import { linkActiveStyles, linkStyles, menuLinksWrapperStyles } from "./style.css";

function MenuLinks() {
  const { user } = useViewContext().containerInstance.get(ProfileStorage);
  return (
    <div className={menuLinksWrapperStyles}>
      <RenderLink href="/" name="home" />
      <RenderLink href="/projects" activeHrefs={["/projects", "/documents", "/document-revisions"]} name="projects" />
      <RenderLink
        href="/correspondences"
        activeHrefs={["/correspondences", "/correspondence-revisions"]}
        name="correspondences"
      />
      <RenderLink href="/tickets" name="tickets" />
      <RenderLink href="/user-flow" name="user_flow" />
      <RenderLink href="/users" name="users" />
      {user.isAdmin && <RenderLink href="/settings" name="settings" />}
    </div>
  );
}

export default React.memo(MenuLinks);

function RenderLink({ href, name, activeHrefs }: { href: string; name: string; activeHrefs?: string[] }) {
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const active =
    href === "/"
      ? href === pathname
      : activeHrefs
      ? activeHrefs.some((href) => pathname.startsWith(href))
      : pathname.startsWith(href);

  return (
    <Link className={cn(linkStyles, active && linkActiveStyles)} href={href}>
      {t({ scope: "menu_links", name })}
    </Link>
  );
}
