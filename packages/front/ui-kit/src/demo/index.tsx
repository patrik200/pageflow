import React from "react";
import ReactDOM from "react-dom/client";

import { RunDemonstrator } from "../demonstrator";

import { rootWrapperStyle } from "./style.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RunDemonstrator rootElement={root} className={rootWrapperStyle} />);
