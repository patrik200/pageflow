import React from "react";
import { observer } from "mobx-react-lite";

function YandexMetrica() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    // @ts-ignore
    import("./script");
  }, []);

  return null;
}

export default observer(YandexMetrica);
