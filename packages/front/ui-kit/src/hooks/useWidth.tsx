import React from "react";

export function useWidth() {
  const [width, setWidth] = React.useState(0);

  const handleResize = React.useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  React.useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return width;
}
