import React from "react";
import { useTranslation } from "react-i18next";
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

const WebUiLink = ({ stats }: { stats: Stats }) => {
    return (
        <>
            <br />
            <a
                href={"http://" + stats.ip + "/"}
                target="_blank"
                rel="noreferrer"
            >
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
    const { t } = useTranslation();

    return (
        <Card
            className="select-card"
            footer={
                <Button onClick={onClick} disabled={disabled}>
                    {t("card.wifi.configure")}
                </Button>
            }
        >
            <div className="select-icon">
                <FontAwesomeIcon icon={faWifi as IconDefinition} size="4x" />
            </div>
            <>
                {stats?.connectedTo === undefined &&
                    stats?.apSSID === undefined && (
                        <>{t("card.wifi.configure.description")}</>
                    )}
            </>
            <>
                {stats?.apSSID !== undefined &&
                    stats?.connectedTo === undefined && (
                        <>
                            {t("card.wifi.access-point")}{" "}
                            <span className="text-nowrap">
                                {stats?.apSSID} {stats.signal}
                            </span>
                            <WebUiLink stats={stats} />
                        </>
                    )}
            </>
            <>
                {stats?.connectedTo !== undefined && (
                    <>
                        {t("card.wifi.connected-to")}{" "}
                        <span className="text-nowrap">
                            {stats?.connectedTo} ({stats?.signal})
                        </span>
                        <WebUiLink stats={stats} />
                    </>
                )}
            </>
        </Card>
    );
};
