import React from "react";
import { Board } from "../../../model/Boards";
import { Config } from "../../../model/Config";
import { deepMerge } from "../../../utils/utils";
import BescSpindle from "../spindledriver/BescSpindle";
import PwmSpindle from "../spindledriver/PwmSpindle";
import TenVSpindle from "../spindledriver/TenVSpindle";

type SpindleDriverGroupProps = {
    board: Board;
    config?: Config;
    setValue: (value?: Config) => void;
};

const SpindleDriverGroup = ({
    board,
    config,
    setValue
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
            />
            <BescSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
            />
            <PwmSpindle
                board={board}
                config={config}
                setValue={setValue}
                updateSpindleDriverValue={updateSpindleDriverValue}
            />
        </>
    );
};

export default SpindleDriverGroup;
