import React from "react";
import { Axes } from "../../../model/Config";
import AxisGroup from "./AxisGroup";
import PinField from "../fields/PinField";
import { Board } from "../../../model/Boards";

type SelectFieldProps = {
    board: Board;
    axes?: Axes;
    setValue?: (value: Axes) => void;
};

const AxesGroup = ({
    board,
    axes,
    setValue = (value: Axes) => {}
}: SelectFieldProps) => {
    return (
        <>
            <h4>Axes</h4>

            <PinField
                label="Shared disable pin"
                board={board}
                setValue={(value) => {}}
            />
            <PinField
                label="Shared reset pin"
                board={board}
                setValue={(value) => {}}
            />

            <AxisGroup
                axisLabel="X"
                axis={axes?.x}
                setValue={(value) => setValue({ ...axes, x: value })}
            />
            <AxisGroup
                axisLabel="Y"
                axis={axes?.y}
                setValue={(value) => setValue({ ...axes, y: value })}
            />
            <AxisGroup
                axisLabel="Z"
                axis={axes?.z}
                setValue={(value) => setValue({ ...axes, z: value })}
            />
            <AxisGroup
                axisLabel="A"
                axis={axes?.a}
                setValue={(value) => setValue({ ...axes, a: value })}
            />
            <AxisGroup
                axisLabel="B"
                axis={axes?.b}
                setValue={(value) => setValue({ ...axes, b: value })}
            />
            <AxisGroup
                axisLabel="C"
                axis={axes?.c}
                setValue={(value) => setValue({ ...axes, c: value })}
            />

            <br />
            <br />
        </>
    );
};

export default AxesGroup;
