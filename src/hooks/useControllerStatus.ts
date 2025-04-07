import { useEffect, useState } from "react";
import { ControllerService, ControllerStatus } from "../services";

const useControllerStatus = (controllerService: ControllerService) => {
    const [controllerStatus, setControllerStatus] = useState<ControllerStatus>(
        ControllerStatus.DISCONNECTED
    );

    useEffect(() => {
        if (!controllerService) {
            setControllerStatus(ControllerStatus.DISCONNECTED);
            return;
        }

        const listener = (status) => {
            setControllerStatus(status);
        };

        controllerService?.addListener(listener);
        setControllerStatus(controllerService.status);

        () => controllerService?.removeListener(listener);
    }, [controllerService]);

    return controllerStatus;
};

export default useControllerStatus;
