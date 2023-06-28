import React, { useContext, useEffect, useState } from "react";
import Button from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faDownload, faExclamation, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import { Card } from "react-bootstrap";

type InstallCardProps = {
    disabled?: boolean;
    onClick: () => void;
};

export const InstallCard = ({
    onClick,
    disabled = false
}: InstallCardProps) => {
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
    }, [controllerService])


    return (
        <Card className="select-card">
            <Card.Body>
                <div className="select-icon">
                    <FontAwesomeIcon
                        icon={faDownload as IconDefinition}
                        size="4x"
                    />
                </div>

                {stats?.version && <p>
                    Upgrade FluidNC on your controller
                </p>}
                {!stats?.version && <p>
                    The controller doesn't seem to have FluidNC installed, do you wish to install it?
                </p>}

            </Card.Body>

            <Card.Footer>
                <Button onClick={onClick} disabled={disabled}>
                    <>{stats?.version ? "Upgrade" : "Install"} FluidNC</>
                </Button>
            </Card.Footer>
        </Card>
    );
};
