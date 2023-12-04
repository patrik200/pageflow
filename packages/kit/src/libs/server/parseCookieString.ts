export function parseCookieString(cookieString: string) {
  return Object.fromEntries(
    cookieString.split("; ").map((cookiePair) => {
      const [cookieName, cookieValue] = cookiePair.split("=");
      return [cookieName, cookieValue] as const;
    }),
  );
}
