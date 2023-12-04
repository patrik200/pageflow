import React, { Suspense } from "react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { Spinner } from "@app/ui-kit";

import { spinnerStyles, spinnerWrapperStyles } from "./style.css";

type AsyncModalContentInterface<PROPS extends Record<string, any>> = PROPS & {
  forceLoading?: boolean;
  asyncFallback?: boolean;
  asyncComponent: () => Promise<{ default: React.FC<PROPS> }>;
};

function AsyncModalContent<PROPS extends Record<string, any>>({
  forceLoading,
  asyncComponent,
  asyncFallback = true,
  ...props
}: AsyncModalContentInterface<PROPS>) {
  const Component = React.useMemo(() => dynamic(asyncComponent, { suspense: true }), [asyncComponent]);

  const loader = (
    <div className={spinnerWrapperStyles}>
      <Spinner className={spinnerStyles} />
    </div>
  );

  return (
    <Suspense fallback={asyncFallback && loader}>{forceLoading ? loader : <Component {...(props as any)} />}</Suspense>
  );
}

export default observer(AsyncModalContent);
