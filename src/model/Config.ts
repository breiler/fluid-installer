export type Config = {
    /**
     * Descriptive text such as "ESP32 Dev Controller V4".
     */
    board?: string;

    /**
     * A basic description of the machine such as "Router XYYZ 10V Spindle"
     */
    name?: string;

    /**
     * This is used to store information about the config file such as "B. Dring 2022-03-15 Rev 2"
     */
    meta?: string;

    arc_tolerance_mm?: number;

    junction_deviation_mm?: number;

    verbose_errors?: boolean;

    report_inches?: boolean;

    enable_parking_override_control?: boolean;

    use_line_numbers?: boolean;

    planner_blocks?: number;

    stepping?: Stepping;

    axes?: Axes;

    i2so?: I2ISO;
    spi?: SPI;
    sdcard?: SDCard;
    coolant?: Coolant;
    macros?: Macros;
    probe?: Probe;
    "10V"?: Spindle10V;
};

type Start = {
    /**
     * This controls whether you are required to home at startup or not. You will get an homing alarm at startup if this value is true. This prevents motion until you home the machine or clear the alarm.
     */
    must_home: boolean;

    /**
     * Turns off the parking feature.
     */
    deactivate_parking: boolean;

    /**
     *  If true this will report if any limit switches are active at startup if hard_limits is true for the axis.
     */
    check_limit: boolean;
};

export type Axes = {
    shared_stepper_disable_pin?: PinConfig;
    shared_stepper_reset_pin?: PinConfig;
    x?: Axis;
    y?: Axis;
    z?: Axis;
    a?: Axis;
    b?: Axis;
    c?: Axis;
};

export type Axis = {
    steps_per_mm?: number;
    max_rate_mm_per_min?: number;
    acceleration_mm_per_sec2?: number;
    max_travel_mm?: number;
    /**
     *  If set to true, commands that would cause the machine to exceed max_travel_mm will be aborted.
     * Jog commands will be constrained in this mode, so it is not possible to get a soft limit alarm while jogging.
     * The jog will simply stop before the ends of travel. Soft limits relies on an accurate machine position.
     * This typically requires homing first. If you use soft limits alway home the axis before moving the axis via jogs or gcode.
     */
    soft_limits?: boolean;
    homing?: Homing;
    motor0?: Motor;
    motor1?: Motor;
};

export type Stepping = {
    engine?: string;
    idle_ms?: number;
    pulse_us?: number;
    dir_delay_us?: number;
    disable_delay_us?: number;
};

export type I2ISO = {
    bck_pin?: string;
    data_pin?: string;
    ws_pin?: string;
};

export type SPI = {
    miso_pin?: string;
    mosi_pin?: string;
    sck_pin?: string;
};

export type SDCard = {
    card_detect_pin?: string;
    cs_pin?: string;
};

export type Probe = {
    pin?: string;
    check_mode_start?: boolean;
};

export type Coolant = {
    mist_pin?: string;
    flood_pin?: string;
    delay_ms?: string;
};

export type Macros = {
    startup_line0?: string;
    startup_line1?: string;
    macro0?: string;
    macro1?: string;
    macro2?: string;
    macro3?: string;
};

export type Homing = {
    cycle?: number;
    allow_single_axis?: boolean;
    positive_direction?: boolean;
    mpos_mm?: number;
    seek_mm_per_min?: number;
    feed_mm_per_min?: number;
    settle_ms?: number;
    seek_scaler?: number;
    feed_scaler?: number;
};

export type Motor = {
    limit_neg_pin?: string;
    limit_pos_pin?: string;
    limit_all_pin?: string;
    hard_limits?: boolean;
    pulloff_mm?: number;

    standard_stepper?: MotorDriverStandardStepper;
    stepstick?: MotorDriverStepStick;
    tmc_2130?: MotorDriverTMC2130;
    tmc_2208?: MotorDriverTMC2208;
    tmc_2209?: MotorDriverTMC2209;
    tmc_5160?: MotorDriverTMC5160;
    rc_servo?: MotorDriverRCServo;
    solenoid?: MotorDriverSolenoid;
    dynamixel2?: MotorDriverDynamixel2;
};

export type MotorDriverStandardStepper = {
    /**
     * Some external drivers require an inverted step pulse. You can invert the pulse by
     * changing the active state attribute (:high or :low)
     */
    step_pin?: string;

    /**
     * This is used to control the direction. You can invert the direction by changing the
     * active state attribute (:high or :low)
     */
    direction_pin?: string;

    /**
     * This is used if your controller uses individual disable pins for each driver.
     * Most basic controllers use a common disable pin for all drivers and that is set
     * elsewhere in the config file. You can invert the direction by changing the active
     * state attribute (:high or :low)
     */
    disable_pin?: string;
};

export type MotorDriverStepStick = {
    step_pin?: string;
    direction_pin?: string;
    disable_pin?: string;
    ms1_pin?: string;
    ms2_pin?: string;
    ms3_pin?: string;
    reset_pin?: string;
};

export enum TrinamicMode {
    STEALTH_CHOP = "StealthChop",
    COOL_STEP = "CoolStep",
    STALLGUARD = "Stallguard"
}

export type MotorDriverTMC2130 = {
    step_pin?: string;
    direction_pin?: string;
    disable_pin?: string;
    cs_pin?: string;
    spi_index?: string;
    r_sense_ohms?: number;
    run_amps?: number;
    hold_amps?: number;
    microsteps?: number;
    stallguard?: number;
    stallguard_debug?: boolean;
    toff_disable?: number;
    toff_stealthchop?: number;
    toff_coolstep?: string;
    run_mode?: TrinamicMode;
    homing_mode?: TrinamicMode;
    use_enable?: boolean;
};

type MotorDriverTMC2208 = {};
type MotorDriverTMC2209 = {};
type MotorDriverTMC5160 = {};
type MotorDriverRCServo = {};
type MotorDriverSolenoid = {};
type MotorDriverDynamixel2 = {};


export type Spindle10V = {

}

export class PinConfig {
    constructor(pin: Pin | string, pull: PinPull, active: PinActive) {
        this.pin = pin;
        this.pull = pull;
        this.active = active;
    }

    public pin: string;
    public pull: PinPull = PinPull.NONE;
    public active: PinActive = PinActive.HIGH;

    static fromString(pin: string | undefined): PinConfig {
        if (!pin) {
            return new PinConfig(Pin.NO_PIN, PinPull.NONE, PinActive.HIGH);
        }

        const pinParts = pin.toLocaleLowerCase().split(":");
        return new PinConfig(pinParts[0], PinPull.NONE, PinActive.HIGH);
    }

    toString() {
        if (!this.pull || this.pull === PinPull.NONE + "") {
            return this.pin;
        }

        return (
            (this.pin === Pin.NO_PIN ? "NO_PIN" : this.pin) +
            ":" +
            this.pull +
            ":" +
            this.active
        );
    }
}

export enum PinActive {
    HIGH = "high", // Default
    LOW = "low"
}

export enum PinPull {
    NONE = "",
    UP = "pu",
    DOWN = "pd"
}

export enum Pin {
    GPIO_0 = "gpio.0",
    GPIO_1 = "gpio.1",
    GPIO_2 = "gpio.2",
    GPIO_3 = "gpio.3",
    GPIO_4 = "gpio.4",
    GPIO_5 = "gpio.5",
    GPIO_6 = "gpio.6",
    GPIO_7 = "gpio.7",
    GPIO_8 = "gpio.8",
    GPIO_9 = "gpio.9",
    GPIO_10 = "gpio.10",
    GPIO_11 = "gpio.11",
    GPIO_12 = "gpio.12",
    GPIO_13 = "gpio.13",
    GPIO_14 = "gpio.14",
    GPIO_15 = "gpio.15",
    GPIO_16 = "gpio.16",
    GPIO_17 = "gpio.17",
    GPIO_18 = "gpio.18",
    GPIO_19 = "gpio.19",
    GPIO_20 = "gpio.20",
    GPIO_21 = "gpio.21",
    GPIO_22 = "gpio.22",
    GPIO_23 = "gpio.23",
    GPIO_24 = "gpio.24",
    GPIO_25 = "gpio.25",
    GPIO_26 = "gpio.26",
    GPIO_27 = "gpio.27",
    GPIO_28 = "gpio.28",
    GPIO_29 = "gpio.29",
    GPIO_30 = "gpio.30",
    GPIO_31 = "gpio.31",
    GPIO_32 = "gpio.32",
    GPIO_33 = "gpio.33",
    GPIO_34 = "gpio.34",
    GPIO_35 = "gpio.35",
    GPIO_36 = "gpio.36",
    GPIO_37 = "gpio.37",
    GPIO_38 = "gpio.38",
    GPIO_39 = "gpio.39",
    I2SO_0 = "i2so.0",
    I2SO_1 = "i2so.1",
    I2SO_2 = "i2so.2",
    I2SO_3 = "i2so.3",
    I2SO_4 = "i2so.4",
    I2SO_5 = "i2so.5",
    I2SO_6 = "i2so.6",
    I2SO_7 = "i2so.7",
    I2SO_8 = "i2so.8",
    I2SO_9 = "i2so.9",
    I2SO_10 = "i2so.10",
    I2SO_11 = "i2so.11",
    I2SO_12 = "i2so.12",
    I2SO_13 = "i2so.13",
    I2SO_14 = "i2so.14",
    I2SO_15 = "i2so.15",
    I2SO_16 = "i2so.16",
    I2SO_17 = "i2so.17",
    I2SO_18 = "i2so.18",
    I2SO_19 = "i2so.19",
    NO_PIN = "no_pin"
}

export type PinDefinition = {
    pin: Pin;
    input?: boolean;
    /**
     * A flag that indicates of input can use pull up or down
     */
    pull?: boolean;
    output?: boolean;
    /**
     * A flag that indicates that it might be used but with caution or that the pin is used by something else
     */
    restricted?: boolean;
    comment?: string;
};
