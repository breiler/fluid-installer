import React from "react";
import { ControllerService } from "../services/controllerservice";

export const ControllerServiceContext = React.createContext<
    ControllerService | undefined
>(undefined);
