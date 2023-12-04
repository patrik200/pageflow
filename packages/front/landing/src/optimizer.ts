import "reflect-metadata";
import { enableStaticRendering } from "mobx-react-lite";
import { configure } from "mobx";
import { removeMobXArrayLengthWarnings, removeResizeObserverLoopLimitExceeded } from "@app/kit";

enableStaticRendering(typeof window === "undefined");
configure({ enforceActions: "never" });

removeMobXArrayLengthWarnings();

if (typeof window !== "undefined") removeResizeObserverLoopLimitExceeded();

// eslint-disable-next-line import/no-anonymous-default-export
export default null;
