import React, { useContext, useEffect, useState } from "react";
import Page from "../../model/Page";
import "./SelectMode.scss";
import { TerminalCard } from "../../components/terminalcard/TerminalCard";
import { InstallCard } from "../../components/installcard/InstallCard";
import { FileBrowserCard } from "../../components/filebrowsercard/FileBrowserCard";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "../../components";
import { ButtonType } from "../../components/button";
import { Stats } from "../../services/controllerservice/commands/GetStatsCommand";
import SpinnerModal from "../../components/spinnermodal/SpinnerModal";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Props = {
    onSelect: (page: Page) => void;
};

const SelectMode = ({ onSelect }: Props) => {
    const navigate = useNavigate();
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!controllerService) return;
        controllerService.getStats().then(setStats);
    }, [controllerService]);

    const restart = () => {
        setIsLoading(true);
        controllerService?.hardReset().finally(() => setIsLoading(false));
    };

    return (
        <>
            <SpinnerModal show={isLoading} text="Restarting controller..." />
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <InstallCard onClick={() => navigate("/install")} />
                    </div>
                    <div className="col">
                        <TerminalCard onClick={() => navigate("/terminal")} />
                    </div>
                    {stats?.version && (
                        <div className="col">
                            <FileBrowserCard
                                onClick={() => navigate("/filebrowser")}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="container">
                <Card bg="light">
                    <Card.Body>
                        <Button
                            buttonType={ButtonType.DANGER}
                            onClick={() => controllerService?.disconnect()}>
                            <>
                                <FontAwesomeIcon
                                    icon={faPowerOff as IconDefinition}
                                />{" "}
                                Disconnect
                            </>
                        </Button>

                        <Button
                            buttonType={ButtonType.WARNING}
                            onClick={restart}>
                            <>
                                <FontAwesomeIcon
                                    icon={faRefresh as IconDefinition}
                                />{" "}
                                Restart
                            </>
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default SelectMode;
