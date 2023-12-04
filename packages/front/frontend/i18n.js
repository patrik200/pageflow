if (!process.env.I18N_LOCALES) {
  console.error("I18N_LOCALES env is not defined");
  process.exit(1);
}

module.exports = {
  locales: process.env.I18N_LOCALES.split(","),
  defaultLocale: "ru",
  interpolation: { prefix: "{", suffix: "}" },
  loadLocaleFrom: async function (lang, ns) {
    const result = await import(`./public/translations/${lang}/${ns}.json`);
    return result.default;
  },
  pages: {
    "*": ["common"],
    "/auth/login": ["auth-login"],
    "/auth/reset-password": ["auth-reset-password-initial"],
    "/auth/reset-password/finish": ["auth-reset-password-finish"],
    "/": ["home"],
    "/tickets": ["tickets", "ticket-detail", "comments-common"],
    "/tickets/create": ["ticket-detail", "comments-common"],
    "/tickets/[id]": ["ticket-detail", "comments-common"],
    "/projects": ["projects"],
    "/projects/create": ["project-detail"],
    "/projects/[id]": [
      "project-detail",
      "correspondence",
      "correspondence-list",
      "document",
      "document-list",
      "tickets",
      "ticket-detail",
      "comments-common",
      "attributes",
      "goal-list"
    ],
    "/projects/[id]/tickets/create": ["project-detail", "ticket-detail", "comments-common"],
    "/projects/[id]/tickets/[ticketId]": ["project-detail", "ticket-detail", "comments-common"],
    "/projects/[id]/edit": ["project-detail"],
    "/settings": ["settings"],
    "/correspondences": ["correspondence", "correspondence-list", "attributes"],
    "/correspondences/create": ["correspondence", "correspondence-detail", "attributes"],
    "/correspondences/[id]": [
      "correspondence",
      "correspondence-detail",
      "correspondence-list",
      "correspondence-dependencies",
      "document-list",
    ],
    "/correspondences/[id]/edit": ["correspondence", "correspondence-detail", "attributes"],
    "/correspondences/[id]/create-revision": ["correspondence-revision-detail"],
    "/correspondence-revisions/[id]": ["correspondence", "correspondence-revision-detail", "comments-common"],
    "/correspondence-revisions/[id]/edit": ["correspondence", "correspondence-revision-detail"],
    "/documents/create": ["document", "document-detail", "attributes"],
    "/documents/[id]": ["document", "document-detail", "correspondence-list", "document-dependencies"],
    "/documents/[id]/edit": ["document", "document-detail", "attributes"],
    "/documents/[id]/create-revision": ["document-revision-detail"],
    "/document-revisions/[id]": ["document", "document-revision-detail", "user-flow", "comments-common"],
    "/document-revisions/[id]/edit": ["document", "document-revision-detail"],
    "/users": ["users-list", "invitation"],
    "/users/current": ["user-profile"],
    "/users/create": ["user-profile"],
    "/users/[id]": ["user-profile"],
    "/user-flow": ["user-flow"],
    "/invitations/": ["invitation"],
    "/invitations/[id]": ["invitation"],
    "/goals/create": ["goal-detail"],
    "/goals/[id]": ["goal-detail"],
    "/goals/[id]/edit": ["goal-detail"],
  },
  logBuild: false,
};
