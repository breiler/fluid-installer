import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { GetConfigFilenameCommand, ListFilesCommand } from "../../../services";
import usePageView from "../../../hooks/usePageView";
import { fileDataToConfig, sleep } from "../../../utils/utils";
import { ControllerServiceContext } from "../../../context/ControllerServiceContext";
import { Axis, Config, PinConfig } from "../../../model/Config";
import PageTitle from "../../../components/pagetitle/PageTitle";
import CalibratePin from "./CalibratePin";
import {
    GetGpioDumpCommand,
    GpioStatus
} from "../../../services/controllerservice/commands/GetGpioDumpCommand";
import AlertMessage from "../../../components/alertmessage/AlertMessage";
import { Spinner } from "../../../components";

import { Link } from "react-router-dom";
import jsYaml from "js-yaml";

type AxisPinsProps = {
    axis: string;
    gpioStatusList: GpioStatus[];
    axisConfig: Axis;
    onUpdate: (axisConfig: Axis) => void;
};

const AxisPins = ({
    axis,
    gpioStatusList,
    axisConfig,
    onUpdate
}: AxisPinsProps) => {
    return (
        <>
            <CalibratePin
                label={axis + " - Motor 0 - Limit all pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_all_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor0!.limit_all_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
            <CalibratePin
                label={axis + " - Motor 0 - Limit negative pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_neg_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor0!.limit_neg_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
            <CalibratePin
                label={axis + " - Motor 0 - Limit positive pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_pos_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor0!.limit_pos_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit all pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_all_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor1!.limit_all_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit negative pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_neg_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor1!.limit_neg_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit positive pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_pos_pin
                )}
                onUpdateConfig={(pin) => {
                    axisConfig!.motor1!.limit_pos_pin = pin.toString();
                    onUpdate(axisConfig);
                }}
            />
        </>
    );
};

const Calibrate = () => {
    usePageView("Calibration");
    const controllerService = useContext(ControllerServiceContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [config, setConfig] = useState<Config | undefined>();
    const [configFile, setConfigFile] = useState<string>();
    const [gpioStatusList, setGpioStatusList] = useState<GpioStatus[]>([]);
    const [pollForStatus, setPollForStatus] = useState<boolean>(false);

    useEffect(() => {
        let timer;

        if (pollForStatus) {
            timer = setInterval(() => {
                controllerService!
                    .send(new GetGpioDumpCommand())
                    .then((command) => {
                        setGpioStatusList(command.result());
                    })
                    .catch((error) => console.error(error));
            }, 500);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [pollForStatus, controllerService, setGpioStatusList]);

    useEffect(() => {
        async function fetchData() {
            if (!controllerService) {
                return;
            }

            setIsLoading(true);
            // await controllerService.serialPort.write(Buffer.from([0x0c])); // CTRL-L Restting echo mode
            const configFilenameCommand = await controllerService.send(
                new GetConfigFilenameCommand()
            );
            setConfigFile(configFilenameCommand.result());
            console.log(
                "Configured config file",
                configFilenameCommand.result()
            );

            const listCommand = await controllerService.send(
                new ListFilesCommand()
            );

            const configFileExists =
                listCommand
                    .result()
                    .map((f) => f.name)
                    .indexOf(configFilenameCommand.result()) > -1;

            console.log("Config file exists", configFileExists);
            if (configFileExists) {
                const fileData = await controllerService.downloadFile(
                    configFilenameCommand.result()
                );
                setConfig(fileDataToConfig(fileData.toString()));

                console.log("Fetched config file");

                await sleep(200);
                setPollForStatus(true);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [
        controllerService,
        setIsLoading,
        setConfig,
        setConfigFile,
        setPollForStatus
    ]);

    const save = async (config: Config) => {
        setIsLoading(true);
        setPollForStatus(false);
        await sleep(1000);

        const configData = jsYaml.dump(config, { noCompatMode: true });

        // FluidNC "YAML" does not implement null
        configData.replace(/: null\n/g, ":\n");

        await controllerService!.uploadFile(
            "/littlefs/" + configFile,
            Buffer.from(configData)
        );

        await controllerService?.hardReset();
        setIsLoading(false);
        setPollForStatus(true);
    };

    return (
        <>
            <PageTitle>Calibrate</PageTitle>

            {isLoading && (
                <AlertMessage variant="info">
                    Loading the config file
                    <Spinner />
                </AlertMessage>
            )}
            {!isLoading && !config && (
                <AlertMessage variant="warning">
                    Could not find the config file <b>{configFile}</b>.<br />
                    Go to the <Link to="/files">file browser</Link> and check
                    that you have a valid configuration file.
                </AlertMessage>
            )}

            {!isLoading && config && (
                <>
                    <AlertMessage variant="info">
                        This page is still a work in progress and will
                        eventually be used for calibrating and fine tune your
                        machine.
                    </AlertMessage>

                    <h3>Input pins</h3>
                    <p>
                        Here you can check that your input pins are triggered
                        correctly. Trigger them manually to make sure they are
                        configured properly.
                    </p>
                    {config?.axes?.x && (
                        <AxisPins
                            axis={"X"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.x}
                            onUpdate={(axis) => {
                                config!.axes!.x = axis;
                                save(config);
                            }}
                        />
                    )}
                    {config?.axes?.y && (
                        <AxisPins
                            axis={"Y"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.y}
                            onUpdate={(axis) => {
                                config!.axes!.y = axis;
                                save(config);
                            }}
                        />
                    )}
                    {config?.axes?.z && (
                        <AxisPins
                            axis={"Z"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.z}
                            onUpdate={(axis) => {
                                config!.axes!.z = axis;
                                save(config);
                            }}
                        />
                    )}
                    {config?.axes?.a && (
                        <AxisPins
                            axis={"A"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.a}
                            onUpdate={(axis) => {
                                config!.axes!.a = axis;
                                save(config);
                            }}
                        />
                    )}
                    {config?.axes?.b && (
                        <AxisPins
                            axis={"B"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.b}
                            onUpdate={(axis) => {
                                config!.axes!.b = axis;
                                save(config);
                            }}
                        />
                    )}
                    {config?.axes?.c && (
                        <AxisPins
                            axis={"C"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.c}
                            onUpdate={(axis) => {
                                config!.axes!.c = axis;
                                save(config);
                            }}
                        />
                    )}
                    <CalibratePin
                        label="Probe pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(config.probe?.pin)}
                        onUpdateConfig={(pin) => {
                            config!.probe!.pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Probe tool setter pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.probe?.toolsetter_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.probe!.toolsetter_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Cycle start pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.cycle_start_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.cycle_start_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="E-stop pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.estop_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.estop_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Fault pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.fault_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.fault_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Feed hold pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.feed_hold_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.fault_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Macro0 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro0_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.macro0_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Macro1 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro1_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.macro1_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Macro2 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro2_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.macro2_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Macro3 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro3_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.macro3_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Reset pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.reset_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.reset_pin = pin.toString();
                            save(config);
                        }}
                    />
                    <CalibratePin
                        label="Safety door pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.safety_door_pin
                        )}
                        onUpdateConfig={(pin) => {
                            config!.control!.safety_door_pin = pin.toString();
                            save(config);
                        }}
                    />
                </>
            )}
        </>
    );
};
export default Calibrate;
