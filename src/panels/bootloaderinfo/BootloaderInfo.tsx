import React, { useEffect, useState } from "react";
import { Spinner } from "../../components";
import PageTitle from "../../components/pagetitle/PageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Alert } from "react-bootstrap";


const BOOLOADER_WARNING_TIMEOUT = 8000;

const BootloaderInfo = () => {
    const [showBootloaderWarning, setShowBootloaderWarning] = useState(false);

    useEffect(() => {
        setShowBootloaderWarning(false);
        setTimeout(() => {
            setShowBootloaderWarning(true);
        }, BOOLOADER_WARNING_TIMEOUT);
    }, []);

    return (
        <>
            <PageTitle>Installing</PageTitle>
            {!showBootloaderWarning && <p>Waiting for controller to enter bootloader... <Spinner /></p>}
            {showBootloaderWarning &&
                <Alert variant="warning">
                    <FontAwesomeIcon icon={faWarning as IconDefinition} size="lg" /> Bootloader not active - Try holding down the BOOT switch
                </Alert>
            }

        </>
    );
};

export default BootloaderInfo;



