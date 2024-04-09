import React from "react";
import { Board } from "../../../model/Boards";
import { Config, PinConfig } from "../../../model/Config";
import { deepMerge } from "../../../utils/utils";
import BescSpindle from "../spindledriver/BescSpindle";
import PwmSpindle from "../spindledriver/PwmSpindle";
import TenVSpindle from "../spindledriver/TenVSpindle";
import LaserSpindle from "../spindledriver/LaserSpindle";

type SpindleDriverGroupProps = {
    board: Board;
    config?: Config;
    setValue: (value?: Config) => void;
    usedPins: Map<string, PinConfig>;
};

const SpindleDriverGroup = ({
    board,
    config,
    setValue,
    usedPins
}: SpindleDriverGroupProps) => {
    const updateSpindleDriverValue = (newConfig: Config) => {
        setValue(deepMerge(config ?? {}, newConfig));
    };

    return (
        <>
            <TenVSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
                usedPins={usedPins}
            />
            <BescSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
                usedPins={usedPins}
            />
            <PwmSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
                usedPins={usedPins}
            />

            <LaserSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
                usedPins={usedPins}
            />
        </>
    );
};

export default SpindleDriverGroup;
