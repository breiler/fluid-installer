import React from "react";
import { Config } from "../../../model/Config";
import SelectField from "../../../components/fields/SelectField";
import TextField from "../../../components/fields/TextField";
import BooleanField from "../../../components/fields/BooleanField";

type KinematicsGroupProps = {
    config?: Config;
    setValue?: (config: Config) => void;
};

const KinematicsGroup = ({
    config,
    setValue = () => {}
}: KinematicsGroupProps) => {
    return (
        <>
            <h4>Kinematics</h4>
            <SelectField
                label="Type"
                value={
                    config?.kinematics
                        ? Object.keys(config.kinematics)[0]
                        : undefined
                }
                setValue={(value) => {
                    const newConfig = {
                        ...config!
                    };

                    if (Object.keys(config.kinematics)[0] !== value && value) {
                        newConfig.kinematics = {
                            Cartesian: undefined,
                            corexy: undefined,
                            WallPlotter: undefined,
                            midtbot: undefined,
                            parallel_delta: undefined
                        };
                        newConfig.kinematics[value] = {};
                    }

                    setValue(newConfig);
                }}
                options={[
                    {
                        name: "Cartesian",
                        value: "Cartesian"
                    },
                    {
                        name: "CoreXY",
                        value: "corexy"
                    },
                    {
                        name: "midtbot",
                        value: "midtbot"
                    },
                    {
                        name: "parallel_delta",
                        value: "parallel_delta"
                    },
                    {
                        name: "WallPlotter",
                        value: "WallPlotter"
                    }
                ]}
                helpText="Kinematics define how motors move the tool, choose the type that matches your machine"
            />

            {config?.kinematics?.WallPlotter && (
                <>
                    <TextField
                        label="Left axis"
                        value={config?.kinematics?.WallPlotter?.left_axis ?? 0}
                        setValue={(value) => {
                            config.kinematics.WallPlotter.left_axis = isNaN(
                                +value
                            )
                                ? 0
                                : +value;
                            setValue(config);
                        }}
                    />

                    <TextField
                        label="Left anchor X"
                        value={
                            config?.kinematics?.WallPlotter?.left_anchor_x ??
                            -100
                        }
                        setValue={(value) => {
                            config.kinematics.WallPlotter.left_anchor_x =
                                +value;
                            setValue(config);
                        }}
                        unit="mm"
                    />

                    <TextField
                        label="Left anchor Y"
                        value={
                            config?.kinematics?.WallPlotter?.left_anchor_y ??
                            -100
                        }
                        setValue={(value) => {
                            config.kinematics.WallPlotter.left_anchor_y =
                                +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />

                    <TextField
                        label="Right axis"
                        value={config?.kinematics?.WallPlotter?.right_axis ?? 1}
                        setValue={(value) => {
                            config.kinematics.WallPlotter.right_axis = isNaN(
                                +value
                            )
                                ? 0
                                : +value;
                            setValue(config);
                        }}
                    />

                    <TextField
                        label="Right anchor X"
                        value={
                            config?.kinematics?.WallPlotter?.right_anchor_x ??
                            100
                        }
                        setValue={(value) => {
                            config.kinematics.WallPlotter.right_anchor_x =
                                +value;
                            setValue(config);
                        }}
                        unit="mm"
                    />

                    <TextField
                        label="Right anchor Y"
                        value={
                            config?.kinematics?.WallPlotter?.right_anchor_y ??
                            100
                        }
                        setValue={(value) => {
                            config.kinematics.WallPlotter.right_anchor_y =
                                +value;
                            setValue(config);
                        }}
                        unit="mm"
                    />

                    <TextField
                        label="Segment length"
                        value={
                            config?.kinematics?.WallPlotter?.segment_length ??
                            10
                        }
                        setValue={(value) => {
                            config.kinematics.WallPlotter.segment_length =
                                +value;
                            setValue(config);
                        }}
                        unit="mm"
                    />
                </>
            )}

            {config?.kinematics?.parallel_delta && (
                <>
                    <TextField
                        label="Crank"
                        value={
                            config?.kinematics?.parallel_delta?.crank_mm ?? 70
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.crank_mm = isNaN(
                                +value
                            )
                                ? 0
                                : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <TextField
                        label="Base triangle"
                        value={
                            config?.kinematics?.parallel_delta
                                ?.base_triangle_mm ?? 179.437
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.base_triangle_mm =
                                isNaN(+value) ? 0 : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <TextField
                        label="Linkage"
                        value={
                            config?.kinematics?.parallel_delta?.linkage_mm ??
                            133.5
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.linkage_mm = isNaN(
                                +value
                            )
                                ? 0
                                : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <TextField
                        label="End effector triangle"
                        value={
                            config?.kinematics?.parallel_delta
                                ?.end_effector_triangle_mm ?? 86.603
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.end_effector_triangle_mm =
                                isNaN(+value) ? 0 : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <TextField
                        label="Segment length"
                        value={
                            config?.kinematics?.parallel_delta
                                ?.kinematic_segment_len_mm ?? 1
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.kinematic_segment_len_mm =
                                isNaN(+value) ? 0 : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <TextField
                        label="Homing Mpos"
                        value={
                            config?.kinematics?.parallel_delta
                                ?.homing_mpos_radians ?? 0
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.homing_mpos_radians =
                                isNaN(+value) ? 0 : +value;

                            setValue(config);
                        }}
                        unit="radians"
                    />
                    <BooleanField
                        label="Soft limits"
                        value={
                            config?.kinematics?.parallel_delta?.soft_limits ??
                            false
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.soft_limits =
                                value;

                            setValue(config);
                        }}
                    />
                    <TextField
                        label="Max Z"
                        value={
                            config?.kinematics?.parallel_delta?.max_z_mm ?? 0
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.max_z_mm = isNaN(
                                +value
                            )
                                ? 0
                                : +value;

                            setValue(config);
                        }}
                        unit="mm"
                    />
                    <BooleanField
                        label="Use servos"
                        value={
                            config?.kinematics?.parallel_delta?.use_servos ??
                            true
                        }
                        setValue={(value) => {
                            config.kinematics.parallel_delta.use_servos = value;

                            setValue(config);
                        }}
                    />
                </>
            )}
        </>
    );
};

export default KinematicsGroup;
