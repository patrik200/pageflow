import Script from "next/script";
import { waitFor } from "@worksolutions/utils";
import React from "react";

export default function () {
  const [isSSR, setIsSSR] = React.useState(true);
  React.useEffect(() => setIsSSR(false), []);

  if (isSSR) return null;

  (window as any).__waitFor = waitFor;

  return (
    <Script strategy="lazyOnload">{`
(function(m, e, t, r, i, k, a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r, a.parentNode.insertBefore(k, a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

__waitFor(() => window.ym, 10000, 200).then(() => {
  ym(${process.env.YANDEX_METRICA_ID}, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
}).catch(() => null);
`}</Script>
  );
}
