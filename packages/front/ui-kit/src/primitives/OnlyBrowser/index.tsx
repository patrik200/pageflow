import React from "react";

export default function OnlyBrowser<PROPS extends Object>(
  Component: React.FC<PROPS>,
  FallbackComponent?: React.FC<PROPS>,
): (props: PROPS) => React.JSX.Element | null {
  return function (props: PROPS) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [browser, setBrowser] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => setBrowser(true), []);
    if (browser) return <Component {...props} />;
    return FallbackComponent ? <FallbackComponent {...props} /> : null;
  };
}
