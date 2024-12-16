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
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import PageTitle from "../../components/pagetitle/PageTitle";
import usePageView from "../../hooks/usePageView";
import {
    GetStatsCommand,
    Stats
} from "../../services/controllerservice/commands/GetStatsCommand";
import {
    AccessPoint,
    GetAccessPointListCommand
} from "../../services/controllerservice/commands/GetAccessPointListCommand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faSave,
    faSearch,
    faWifi
} from "@fortawesome/free-solid-svg-icons";
import { Icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import TextField from "../../components/fields/TextField";
import SelectField from "../../components/fields/SelectField";
import {
    GetSettingsCommand,
    Settings
} from "../../services/controllerservice/commands/GetSettingsCommand";
import { Command } from "../../services";
import { Spinner } from "../../components";
import WiFiStats from "./WifiStats";
import { sleep } from "../../utils/utils";
import SpinnerModal from "../../components/spinnermodal/SpinnerModal";

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
            )?.getAccessPoints() ?? [];

        if (result.length === 0) {
            return;
        }
        setAccessPoints(result);
    };

    const refreshStats = async () => {
        setLoadingType("network statistics");
        const result = (
            await controllerService?.send(new GetStatsCommand())
        )?.getStats();

        if (!result) {
            return;
        }
        setStats(result);
    };

    const refresh = async () => {
        setLoadingType("settings");
        console.log("refreshing...");
        await controllerService
            ?.send(new GetSettingsCommand())
            .then((command) => {
                const settings = command.getSettings();
                setSettings(settings);
                setWifiMode(settings.wifiMode);
                setHostname(settings.hostname);
                setStationSSID(settings.stationSSID);
                setStationIpMode(settings.stationIpMode);
                setStationPassword(settings.stationPassword);
                setStationMinSecurity(settings.stationMinSecurity);
                setStationIP(settings.stationIP);
                setStationGateway(settings.stationGateway);
                setStationNetmask(settings.stationNetmask);
                setApSSID(settings.apSSID);
                setApPassword(settings.apPassword);
                setApChannel(settings.apChannel);
                setApIP(settings.apIP);
                setApCountry(settings.apCountry);
            });
    };

    const saveSettings = async () => {
        if (hostname !== settings?.hostname) {
            await controllerService?.send(new Command("$Hostname=" + hostname));
        }

        if (wifiMode !== settings?.wifiMode) {
            await controllerService?.send(
                new Command("$WiFi/Mode=" + wifiMode)
            );
        }

        if (stationSSID !== settings?.stationSSID) {
            await controllerService?.send(
                new Command("$Sta/SSID=" + stationSSID)
            );
        }

        if (stationIpMode !== settings?.stationIpMode) {
            await controllerService?.send(
                new Command("$Sta/IPMode=" + stationIpMode)
            );
        }

        if (stationPassword !== settings?.stationPassword) {
            await controllerService?.send(
                new Command(
                    "$Sta/Password=" + encodePassword(stationPassword ?? "")
                )
            );
        }

        if (stationMinSecurity !== settings?.stationMinSecurity) {
            await controllerService?.send(
                new Command("$Sta/MinSecurity=" + stationMinSecurity)
            );
        }

        if (stationIP !== settings?.stationIP) {
            await controllerService?.send(new Command("$Sta/IP=" + stationIP));
        }

        if (stationGateway !== settings?.stationGateway) {
            await controllerService?.send(
                new Command("$Sta/Gateway=" + stationGateway)
            );
        }

        if (stationNetmask !== settings?.stationNetmask) {
            await controllerService?.send(
                new Command("$Sta/Netmask=" + stationNetmask)
            );
        }

        if (apSSID !== settings?.apSSID) {
            await controllerService?.send(new Command("$AP/SSID=" + apSSID));
        }

        if (apPassword !== settings?.apPassword) {
            await controllerService?.send(
                new Command("$AP/Password=" + encodePassword(apPassword ?? ""))
            );
        }

        if (apChannel !== settings?.apChannel) {
            await controllerService?.send(
                new Command("$AP/Channel=" + apChannel)
            );
        }

        if (apIP !== settings?.apIP) {
            await controllerService?.send(new Command("$AP/IP=" + apIP));
        }

        if (apCountry !== settings?.apCountry) {
            await controllerService?.send(
                new Command("$AP/Country=" + apCountry)
            );
        }

        try {
            setIsSaving(true);
            await controllerService?.hardReset();
            await refresh();
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        sleep(1000)
            .then(() => refresh())
            .then(() => refreshAccessPoints())
            .then(() => refreshStats())
            .finally(() => setIsLoading(false));
    }, [controllerService]);

    return (
        <Form>
            <SpinnerModal show={isLoading} text={`Loading ${loadingType}...`} />
            <SpinnerModal show={isSaving} text={`Saving network settings...`} />

            <PageTitle>Configure WiFi</PageTitle>

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

            <>
                <Row>
                    <Col lg={4} className="d-none d-lg-block"></Col>
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

            {(wifiMode === "STA>AP" || wifiMode === "STA") && (
                <>
                    <h4 style={{ marginTop: "24px" }}>
                        Client station settings
                    </h4>
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
                                    }
                                ></Form.Control>
                                <Dropdown
                                    onToggle={() => refreshAccessPoints()}
                                >
                                    <Dropdown.Toggle
                                        disabled={isSaving || isLoading}
                                    >
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
                                                        }
                                                    >
                                                        <Badge
                                                            bg={getSignalColor(
                                                                accessPoint.signal
                                                            )}
                                                        >
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
                            {
                                name: "DHCP",
                                value: "DHCP"
                            }
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
                                placeholder="Password"
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
                style={{ marginTop: "16px" }}
            >
                <Button
                    onClick={() => saveSettings()}
                    disabled={
                        isSaving ||
                        (hostname === settings?.hostname &&
                            wifiMode === settings?.wifiMode &&
                            stationSSID === settings?.stationSSID &&
                            stationIpMode === settings?.stationIpMode &&
                            stationPassword === settings?.stationPassword &&
                            stationMinSecurity ===
                                settings?.stationMinSecurity &&
                            stationIP === settings?.stationIP &&
                            stationGateway === settings?.stationGateway &&
                            stationNetmask === settings?.stationNetmask &&
                            apSSID === settings?.apSSID &&
                            apPassword === settings?.apPassword &&
                            apChannel === settings?.apChannel &&
                            apIP === settings?.apIP &&
                            apCountry === settings?.apCountry)
                    }
                >
                    <FontAwesomeIcon icon={faSave as Icon} /> Save{" "}
                    {isSaving && <Spinner />}
                </Button>
            </div>
        </Form>
    );
};

export default WiFiSettings;
