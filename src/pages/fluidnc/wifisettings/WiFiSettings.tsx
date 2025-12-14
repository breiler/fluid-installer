import React, { useContext, useEffect, useState } from "react";
import {
    Badge,
    Button,
    Col,
    Dropdown,
    Form,
    InputGroup,
    Row
} from "react-bootstrap";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import PageTitle from "../../../components/pagetitle/PageTitle";
import usePageView from "../../../hooks/usePageView";
import {
    GetStatsCommand,
    Stats
} from "../../../services/controllerservice/commands/GetStatsCommand";
import {
    AccessPoint,
    GetAccessPointListCommand
} from "../../../services/controllerservice/commands/GetAccessPointListCommand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faSave,
    faSearch,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import { Icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import TextField from "../../../components/fields/TextField";
import SelectField from "../../../components/fields/SelectField";
import {
    GetSettingsCommand,
    Settings
} from "../../../services/controllerservice/commands/GetSettingsCommand";
import { Command } from "../../../services";
import { Spinner } from "../../../components";
import AlertMessage from "../../../components/alertmessage/AlertMessage";
import WiFiStats from "./WifiStats";
import { sleep } from "../../../utils/utils";

const getSignalColor = (signal: number) => {
    if (signal > 60) {
        return "success";
    } else if (signal > 30) {
        return "warning";
    } else {
        return "danger";
    }
};

const encodePassword = (password: string) => {
    return password
        .replace("%", "%25")
        .replace("!", "%21")
        .replace("?", "%3F")
        .replace("~", "%75");
};

const WiFiSettings = () => {
    usePageView("WiFi Settings");
    const controllerService = useContext(ControllerServiceContext);
    const [stats, setStats] = useState<Stats>();
    const [settings, setSettings] = useState<Settings>();
    const [accessPoints, setAccessPoints] = useState<AccessPoint[]>();

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingType, setLoadingType] = useState<string>("");

    const [hostname, setHostname] = useState<string>();
    const [wifiMode, setWifiMode] = useState<string>();
    const [stationSSID, setStationSSID] = useState<string>();
    const [stationIpMode, setStationIpMode] = useState<string>();
    const [stationPassword, setStationPassword] = useState<string>();
    const [stationMinSecurity, setStationMinSecurity] = useState<string>();
    const [stationIP, setStationIP] = useState<string>();
    const [stationGateway, setStationGateway] = useState<string>();
    const [stationNetmask, setStationNetmask] = useState<string>();
    const [apSSID, setApSSID] = useState<string>();
    const [apPassword, setApPassword] = useState<string>();
    const [apChannel, setApChannel] = useState<string>();
    const [apIP, setApIP] = useState<string>();
    const [apCountry, setApCountry] = useState<string>();

    const refreshAccessPoints = async () => {
        setLoadingType("access points");
        const result =
            (
                await controllerService?.send(new GetAccessPointListCommand())
            )?.result() ?? [];

        if (result.length === 0) {
            return;
        }
        setAccessPoints(result);
    };

    const refreshStats = async () => {
        setLoadingType("network statistics");
        const result = (
            await controllerService?.send(new GetStatsCommand())
        )?.result();

        if (!result) {
            return;
        }
        setStats(result);
    };

    const refresh = async () => {
        setLoadingType("settings");
        await controllerService
            ?.send(new GetSettingsCommand())
            .then((command) => {
                const settings = command.result();
                setSettings(settings);
                setWifiMode(settings.get("WiFi/Mode"));
                setHostname(settings.get("Hostname"));
                setStationSSID(settings.get("Sta/SSID"));
                setStationIpMode(settings.get("Sta/IPMode"));
                setStationPassword(settings.get("Sta/Password"));
                setStationMinSecurity(settings.get("Sta/MinSecurity"));
                setStationIP(settings.get("Sta/IP"));
                setStationGateway(settings.get("Sta/Gateway"));
                setStationNetmask(settings.get("Sta/Netmask"));
                setApSSID(settings.get("AP/SSID"));
                setApPassword(settings.get("AP/Password"));
                setApChannel(settings.get("AP/Channel"));
                setApIP(settings.get("AP/IP"));
                setApCountry(settings.get("AP/Country"));
            });
    };

    const saveSettings = async () => {
        setIsSaving(true);
        const setSetting = async (name: string, value: string) => {
            if (value && value != settings.get(name)) {
                await controllerService.send(
                    new Command("$" + name + "=" + value)
                );
            }
        };
        try {
            setSetting("Hostname", hostname);
            setSetting("WiFi/Mode", wifiMode);

            if (wifiMode === "STA>AP" || wifiMode === "STA") {
                setSetting("Sta/SSID", stationSSID);
                setSetting("Sta/IpMode", stationIpMode);
                setSetting("Sta/MinSecurity", stationMinSecurity);
                setSetting("Sta/IP", stationIP);
                setSetting("Sta/Gateway", stationGateway);
                setSetting("Sta/Netmask", stationNetmask);

                if (stationPassword !== settings.get("Sta/Password")) {
                    await controllerService?.send(
                        new Command(
                            "$Sta/Password=" +
                                encodePassword(stationPassword ?? "")
                        )
                    );
                }
            }

            if (wifiMode === "STA>AP" || wifiMode === "AP") {
                setSetting("AP/SSID", apSSID);
                setSetting("AP/Channel", apChannel);
                setSetting("AP/IP", apIP);
                setSetting("AP/Country", apCountry);

                if (
                    apPassword !== settings.get("AP/Password") &&
                    apPassword !== "********"
                ) {
                    await controllerService?.send(
                        new Command(
                            "$AP/Password=" + encodePassword(apPassword ?? "")
                        )
                    );
                }
            }

            await controllerService?.hardReset();
            await refreshStats();
            await refresh();
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        sleep(100)
            .then(() => refreshStats())
            .then(() => refresh())
            .then(() => refreshAccessPoints())
            .finally(() => setIsLoading(false));
    }, [controllerService]);

    return (
        <Form>
            <PageTitle>Configure WiFi</PageTitle>
            <h4 style={{ marginTop: "24px" }}>Current WiFi connection</h4>
            <>
                <Row>
                    {!isSaving && (
                        <Col>
                            <WiFiStats
                                stats={stats ?? {}}
                                onRefresh={() => refreshStats()}
                            />
                        </Col>
                    )}
                </Row>
            </>

            <h4 style={{ marginTop: "24px" }}>General settings</h4>
            <TextField
                label="Hostname"
                disabled={isSaving || isLoading}
                value={hostname}
                placeholder="Hostname"
                setValue={(value) => setHostname("" + value)}
            />

            <SelectField
                label="WiFi mode"
                disabled={isSaving || isLoading}
                options={[
                    { name: "Off", value: "Off" },
                    {
                        name: "Client station (fallback to access point)",
                        value: "STA>AP"
                    },
                    {
                        name: "Client station",
                        value: "STA"
                    },
                    {
                        name: "Access point",
                        value: "AP"
                    }
                ]}
                setValue={async (value) => setWifiMode(value)}
                value={wifiMode}
            />

            {(wifiMode === "STA>AP" || wifiMode === "STA") && (
                <>
                    <h4 style={{ marginTop: "24px" }}>
                        Client station settings
                    </h4>
                    {isLoading && loadingType == "access points" && (
                        <AlertMessage variant="info">
                            {`Loading ${loadingType}`} <Spinner />
                        </AlertMessage>
                    )}

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4">
                            SSID
                        </Form.Label>
                        <Col>
                            <InputGroup>
                                <Form.Control
                                    disabled={isSaving || isLoading}
                                    aria-label={"SSID"}
                                    value={stationSSID}
                                    type="text"
                                    onChange={(e) =>
                                        setStationSSID(e.target.value)
                                    }></Form.Control>
                                <Dropdown
                                    onToggle={() => refreshAccessPoints()}>
                                    <Dropdown.Toggle
                                        disabled={isSaving || isLoading}>
                                        <FontAwesomeIcon
                                            icon={faSearch as IconDefinition}
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {accessPoints?.map(
                                            (accessPoint, index) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() =>
                                                            setStationSSID(
                                                                accessPoint.ssid
                                                            )
                                                        }>
                                                        <Badge
                                                            bg={getSignalColor(
                                                                accessPoint.signal
                                                            )}>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faWifi as IconDefinition
                                                                }
                                                            />
                                                        </Badge>{" "}
                                                        {accessPoint.ssid}
                                                        {" (" +
                                                            accessPoint.signal +
                                                            "%) "}
                                                        {accessPoint.isProtected && (
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faLock as IconDefinition
                                                                }
                                                                color="gray"
                                                                size="xs"
                                                            />
                                                        )}
                                                    </Dropdown.Item>
                                                );
                                            }
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <TextField
                        label="Password"
                        disabled={isSaving || isLoading}
                        value={stationPassword}
                        placeholder="Password"
                        setValue={(value) => setStationPassword("" + value)}
                        type="password"
                        validationMessage={
                            (stationPassword ?? "").length < 8
                                ? "Password must be at least 8 characters"
                                : undefined
                        }
                    />

                    <SelectField
                        label="Min security"
                        disabled={isSaving || isLoading}
                        options={[
                            { name: "OPEN", value: "OPEN" },
                            { name: "WEP", value: "WEP" },
                            { name: "WPA-PSK", value: "WPA-PSK" },
                            { name: "WPA-WPA2-PSK", value: "WPA-WPA2-PSK" },
                            {
                                name: "WPA2-ENTERPRISE",
                                value: "WPA2-ENTERPRISE"
                            },
                            {
                                name: "WPA2-PSK",
                                value: "WPA2-PSK"
                            }
                        ]}
                        setValue={async (value) => setStationMinSecurity(value)}
                        value={stationMinSecurity}
                    />

                    <SelectField
                        label="IP mode"
                        disabled={isSaving || isLoading}
                        options={[
                            { name: "Static", value: "Static" },
                            { name: "DHCP", value: "DHCP" }
                        ]}
                        setValue={async (value) => setStationIpMode(value)}
                        value={stationIpMode}
                    />

                    {stationIpMode === "Static" && (
                        <>
                            <TextField
                                label="IP"
                                disabled={isSaving || isLoading}
                                value={stationIP}
                                placeholder="IP"
                                setValue={(value) => setStationIP("" + value)}
                            />
                            <TextField
                                label="Gateway"
                                disabled={isSaving || isLoading}
                                value={stationGateway}
                                placeholder="Gateway"
                                setValue={(value) =>
                                    setStationGateway("" + value)
                                }
                            />
                            <TextField
                                label="Netmask"
                                disabled={isSaving || isLoading}
                                value={stationNetmask}
                                placeholder="Netmask"
                                setValue={(value) =>
                                    setStationNetmask("" + value)
                                }
                            />
                        </>
                    )}
                </>
            )}

            {(wifiMode === "STA>AP" || wifiMode === "AP") && (
                <>
                    <h4 style={{ marginTop: "24px" }}>Access point settings</h4>
                    <TextField
                        label="SSID"
                        disabled={isSaving || isLoading}
                        value={apSSID}
                        placeholder="AP SSID"
                        setValue={(value) => setApSSID("" + value)}
                    />

                    <TextField
                        label="Password"
                        disabled={isSaving || isLoading}
                        value={apPassword}
                        placeholder="Password"
                        setValue={(value) => setApPassword("" + value)}
                        type="password"
                        validationMessage={
                            (apPassword ?? "").length < 8
                                ? "Password must be at least 8 characters"
                                : undefined
                        }
                    />

                    <SelectField
                        label="Country"
                        disabled={isSaving || isLoading}
                        placeholder="Country"
                        value={apCountry}
                        setValue={(value) => setApCountry("" + value)}
                        options={[
                            { name: "01", value: "01" },
                            { name: "AT", value: "AT" },
                            { name: "AU", value: "AU" },
                            { name: "BE", value: "BE" },
                            { name: "BG", value: "BG" },
                            { name: "BR", value: "BR" },
                            { name: "CA", value: "CA" },
                            { name: "CH", value: "CH" },
                            { name: "CN", value: "CN" },
                            { name: "CY", value: "CY" },
                            { name: "CZ", value: "CZ" },
                            { name: "DE", value: "DE" },
                            { name: "DK", value: "DK" },
                            { name: "EE", value: "EE" },
                            { name: "ES", value: "ES" },
                            { name: "FI", value: "FI" },
                            { name: "FR", value: "FR" },
                            { name: "GB", value: "GB" },
                            { name: "GR", value: "GR" },
                            { name: "HK", value: "HK" },
                            { name: "HR", value: "HR" },
                            { name: "HU", value: "HU" },
                            { name: "IE", value: "IE" },
                            { name: "IN", value: "IN" },
                            { name: "IS", value: "IS" },
                            { name: "IT", value: "IT" },
                            { name: "JP", value: "JP" },
                            { name: "KR", value: "KR" },
                            { name: "LI", value: "LI" },
                            { name: "LT", value: "LT" },
                            { name: "LU", value: "LU" },
                            { name: "LV", value: "LV" },
                            { name: "MT", value: "MT" },
                            { name: "MX", value: "MX" },
                            { name: "NL", value: "NL" },
                            { name: "NO", value: "NO" },
                            { name: "NZ", value: "NZ" },
                            { name: "PL", value: "PL" },
                            { name: "PT", value: "PT" },
                            { name: "RO", value: "RO" },
                            { name: "SE", value: "SE" },
                            { name: "SI", value: "SI" },
                            { name: "SK", value: "SK" },
                            { name: "TW", value: "TW" },
                            { name: "US", value: "US" }
                        ]}
                    />
                    <TextField
                        label="Channel"
                        disabled={isSaving || isLoading}
                        value={apChannel}
                        placeholder="Channel"
                        setValue={(value) => setApChannel("" + value)}
                    />
                    <TextField
                        label="IP"
                        disabled={isSaving || isLoading}
                        value={apIP}
                        placeholder="IP"
                        setValue={(value) => setApIP("" + value)}
                    />
                </>
            )}

            <div
                className="d-flex justify-content-end"
                style={{ marginTop: "16px" }}>
                <Button
                    onClick={() => saveSettings()}
                    disabled={
                        isSaving ||
                        (hostname === settings?.get("Hostname") &&
                            wifiMode === settings?.get("WiFi/Mode") &&
                            stationSSID === settings?.get("Sta/SSID") &&
                            stationIpMode === settings?.get("Sta/IPMode") &&
                            stationPassword === settings?.get("Sta/Password") &&
                            stationMinSecurity ===
                                settings?.get("Sta/MinSecurity") &&
                            stationIP === settings?.get("Sta/IP") &&
                            stationGateway === settings?.get("Sta/Gateway") &&
                            stationNetmask === settings?.get("Sta/Netmask") &&
                            apSSID === settings?.get("AP/SSID") &&
                            apPassword === settings?.get("AP/Password") &&
                            apChannel === settings?.get("AP/Channel") &&
                            apIP === settings?.get("AP/IP") &&
                            apCountry === settings?.get("AP/Country"))
                    }>
                    <FontAwesomeIcon icon={faSave as Icon} /> Save{" "}
                    {isSaving && <Spinner />}
                </Button>
            </div>
        </Form>
    );
};

export default WiFiSettings;
