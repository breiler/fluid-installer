import React, { useEffect, useState } from "react";
import Card from "../card";
import Button from "../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Stats } from "../../../services/controllerservice/commands/GetStatsCommand";

type WiFiCardProps = {
    disabled?: boolean;
    stats?: Stats;
    onClick: () => void;
};

async function fetchWithTimeout(
    resource,
    options: RequestInit = {},
    timeout = 8000
) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

const WebUiLink = ({ stats }: { stats: Stats }) => {
    return (
        <>
            <br />
            <a href={"http://" + stats.ip + "/"} target="_blank" rel="noreferrer">
                http://{stats.ip}/
            </a>
        </>
    );
};

export const WiFiCard = ({
    onClick,
    disabled = false,
    stats
}: WiFiCardProps) => {
    const [accessWebUI, setAccessWebUI] = useState(false);

    useEffect(() => {
        if (!stats) {
            return;
        }

        const timer = setInterval(() => {
            const url = "http://" + stats.ip + "/";
            fetchWithTimeout(
                url,
                {
                    mode: "no-cors"
                },
                2000
            )
                .then(() => setAccessWebUI(true))
                .catch(() => setAccessWebUI(false));
        }, 5000);

        return () => {
            if (!timer) return;

            clearInterval(timer);
        };
    }, [stats]);

    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    <>Configure WiFi</>
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon icon={faWifi as IconDefinition} size="4x" />
            </div>
            <>
                {stats?.connectedTo === undefined &&
                    stats?.apSSID === undefined && (
                        <>Manage the controller WiFi settings</>
                    )}
            </>
            <>
                {stats?.apSSID !== undefined &&
                    stats?.connectedTo === undefined && (
                        <>
                            Access point{" "}
                            <span className="text-nowrap">
                                {stats?.apSSID} {stats.signal}
                            </span>
                            {accessWebUI && <WebUiLink stats={stats} />}
                        </>
                    )}
            </>
            <>
                {stats?.connectedTo !== undefined && (
                    <>
                        Connected to{" "}
                        <span className="text-nowrap">
                            {stats?.connectedTo} ({stats?.signal})
                        </span>
                        {accessWebUI && <WebUiLink stats={stats} />}
                    </>
                )}
            </>
        </Card>
    );
};
