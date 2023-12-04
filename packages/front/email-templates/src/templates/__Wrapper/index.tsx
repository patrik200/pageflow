import React from "react";
import { IntlDate } from "@worksolutions/utils";
import "reseter.css/css/reseter.min.css";

import { europeDateFormats } from "./dateFormats";

import { htmlStyles, mainContainerStyles, mainContentTableStyles, tableStyles } from "./style.css";

interface WrapperInterface {
  maxWidth: string;
  frontendHost: string;
  children: React.ReactNode;
}

function Wrapper({ maxWidth, frontendHost, children }: WrapperInterface) {
  return (
    <html lang="ru" className={htmlStyles}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `\
@font-face{src:url(${frontendHost}/fonts/Roboto-Regular.woff2);font-weight:400;font-family:Roboto}
@font-face{src:url(${frontendHost}/fonts/Roboto-Medium.woff2);font-weight:500;font-family:Roboto}
@font-face{src:url(${frontendHost}/fonts/Roboto-Bold.woff2);font-weight:700;font-family:Roboto}
`,
          }}
        />
      </head>
      <body>
        <table className={tableStyles} role="presentation" border={0} cellPadding="0" cellSpacing="0">
          <tr>
            <td>&nbsp;</td>
            <td style={{ maxWidth }} className={mainContainerStyles}>
              <table className={mainContentTableStyles} role="presentation" border={0} cellPadding="0" cellSpacing="0">
                <tr>
                  <td>{children}</td>
                </tr>
              </table>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  );
}

export default React.memo(Wrapper);

export function useIntlDate() {
  return React.useMemo(
    () => new IntlDate({ languageCode: "ru", matchDateModeAndLuxonTypeLiteral: europeDateFormats }),
    [],
  );
}
