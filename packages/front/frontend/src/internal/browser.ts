import { globalBrowserInitializer } from "@app/front-kit";

import { initializeAccessTokenBrowser } from "./accessToken";

globalBrowserInitializer.set("access token", initializeAccessTokenBrowser);
