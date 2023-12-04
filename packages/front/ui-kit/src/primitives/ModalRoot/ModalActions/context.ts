import React from "react";

export const ModalActionsContext = React.createContext<{ close: () => void }>(null!);
