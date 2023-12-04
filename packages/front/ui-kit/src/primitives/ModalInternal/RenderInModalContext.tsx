import React from "react";
import { without } from "@worksolutions/utils";

import { RenderedInModalContext, RenderedInModalContextActiveValue } from "./context";

interface RenderInModalContextInterface {
  children: React.ReactNode;
}

function RenderInModalContextProvider({ children }: RenderInModalContextInterface) {
  const renderedInContextModal = React.useContext(RenderedInModalContext);
  if (renderedInContextModal) return <>{children}</>;
  return <RenderInModalContextPortalContent>{children}</RenderInModalContextPortalContent>;
}

export default React.memo(RenderInModalContextProvider);

function RenderInModalContextPortalContent({ children }: { children: React.ReactNode }) {
  const newModalContextValue = useNewModalContextValue();
  return <RenderedInModalContext.Provider value={newModalContextValue}>{children}</RenderedInModalContext.Provider>;
}

function useNewModalContextValue() {
  const [openedPath, setOpenedPath] = React.useState<HTMLElement[]>([]);
  const [customCloseOutsideIds, setCustomCloseOutsideIds] = React.useState<string[]>([]);

  const disableCanCloseOutside = React.useCallback((id: string) => setCustomCloseOutsideIds((ids) => [...ids, id]), []);
  const enableCanCloseOutside = React.useCallback(
    (id: string) => setCustomCloseOutsideIds((ids) => without([id], ids)),
    [],
  );

  const addElementToPath = React.useCallback((modalRoot: HTMLElement) => {
    setOpenedPath((path) => (path.includes(modalRoot) ? path : [...path, modalRoot]));
    return () => setOpenedPath((path) => without([modalRoot], path));
  }, []);

  return React.useMemo<RenderedInModalContextActiveValue>(
    () => ({
      canCloseOutside: customCloseOutsideIds.length === 0,
      enableCanCloseOutside,
      disableCanCloseOutside,
      openedPath,
      openedPathWithoutLastElement: openedPath.slice(0, -1),
      addElementToPath,
    }),
    [addElementToPath, customCloseOutsideIds.length, disableCanCloseOutside, enableCanCloseOutside, openedPath],
  );
}
