import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Spinner } from "../../components";
import { GetConfigFilenameCommand, ListFilesCommand } from "../../services";
import usePageView from "../../hooks/usePageView";
import { fileDataToConfig, sleep } from "../../utils/utils";
import { ControllerServiceContext } from "../../context/ControllerServiceContext";
import { Axis, Config, PinConfig } from "../../model/Config";
import PageTitle from "../../components/pagetitle/PageTitle";
import CalibratePin from "./CalibratePin";
import {
    GetGpioDumpCommand,
    GpioStatus
} from "../../services/controllerservice/commands/GetGpioDumpCommand";
import AlertMessage from "../../components/alertmessage/AlertMessage";
import { Link } from "react-router-dom";

type AxisPinsProps = {
    axis: string;
    gpioStatusList: GpioStatus[];
    axisConfig: Axis;
};

const AxisPins = ({ axis, gpioStatusList, axisConfig }: AxisPinsProps) => {
    return (
        <>
            <CalibratePin
                label={axis + " - Motor 0 - Limit all pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_all_pin
                )}
            />
            <CalibratePin
                label={axis + " - Motor 0 - Limit negative pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_neg_pin
                )}
            />
            <CalibratePin
                label={axis + " - Motor 0 - Limit positive pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor0?.limit_pos_pin
                )}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit all pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_all_pin
                )}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit negative pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_neg_pin
                )}
            />
            <CalibratePin
                label={axis + " - Motor 1 - Limit positive pin"}
                gpioStatusList={gpioStatusList}
                pinConfig={PinConfig.fromString(
                    axisConfig.motor1?.limit_pos_pin
                )}
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

    useEffect(() => {
        if (!controllerService) {
            return;
        }

        let timer;
        setIsLoading(true);
        controllerService
            .connect()
            .then(async () => {
                await controllerService.serialPort.write(Buffer.from([0x0c])); // CTRL-L Restting echo mode
                const configFilenameCommand = await controllerService.send(
                    new GetConfigFilenameCommand()
                );
                setConfigFile(configFilenameCommand.getFilename());
                const listCommand = await controllerService.send(
                    new ListFilesCommand()
                );

                if (
                    listCommand
                        .getFiles()
                        .map((f) => f.name)
                        .indexOf(configFilenameCommand.getFilename()) > -1
                ) {
                    const fileData = await controllerService.downloadFile(
                        configFilenameCommand.getFilename()
                    );
                    setConfig(fileDataToConfig(fileData.toString()));

                    await sleep(2000);
                    timer = setInterval(() => {
                        controllerService
                            .send(new GetGpioDumpCommand())
                            .then((command) => {
                                setGpioStatusList(command.getStatusList());
                            })
                            .catch((error) => console.error(error));
                    }, 500);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [
        controllerService,
        setIsLoading,
        setConfig,
        setGpioStatusList,
        setConfigFile
    ]);

    return (
        <>
            <PageTitle>Calibrate</PageTitle>
            {isLoading && (
                <>
                    Loading configuration <Spinner />
                </>
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
                        />
                    )}
                    {config?.axes?.y && (
                        <AxisPins
                            axis={"Y"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.y}
                        />
                    )}
                    {config?.axes?.z && (
                        <AxisPins
                            axis={"Z"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.z}
                        />
                    )}
                    {config?.axes?.a && (
                        <AxisPins
                            axis={"A"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.a}
                        />
                    )}
                    {config?.axes?.b && (
                        <AxisPins
                            axis={"B"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.b}
                        />
                    )}
                    {config?.axes?.c && (
                        <AxisPins
                            axis={"C"}
                            gpioStatusList={gpioStatusList}
                            axisConfig={config?.axes?.c}
                        />
                    )}
                    <CalibratePin
                        label="Probe pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(config.probe?.pin)}
                    />
                    <CalibratePin
                        label="Probe tool setter pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.probe?.toolsetter_pin
                        )}
                    />
                    <CalibratePin
                        label="Cycle start pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.cycle_start_pin
                        )}
                    />
                    <CalibratePin
                        label="E-stop pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.estop_pin
                        )}
                    />
                    <CalibratePin
                        label="Fault pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.fault_pin
                        )}
                    />
                    <CalibratePin
                        label="Feed hold pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.feed_hold_pin
                        )}
                    />
                    <CalibratePin
                        label="Macro0 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro0_pin
                        )}
                    />
                    <CalibratePin
                        label="Macro1 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro1_pin
                        )}
                    />
                    <CalibratePin
                        label="Macro2 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro2_pin
                        )}
                    />
                    <CalibratePin
                        label="Macro3 pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.macro3_pin
                        )}
                    />
                    <CalibratePin
                        label="Reset pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.reset_pin
                        )}
                    />
                    <CalibratePin
                        label="Safety door pin"
                        gpioStatusList={gpioStatusList}
                        pinConfig={PinConfig.fromString(
                            config.control?.safety_door_pin
                        )}
                    />
                </>
            )}
        </>
    );
};
export default Calibrate;
