const addPin = (
    name: string,
    pin: string | undefined,
    usedPins: Map<string, PinConfig>
) => {
    const resolvedPin = PinConfig.fromString(pin);
    if (resolvedPin) {
        usedPins.set(name, resolvedPin);
    }
};

const addMotorPins = (
    path: string,
    motor: Motor | undefined,
    usedPins: Map<string, PinConfig>
) => {
    if (!motor) {
        return;
    }

    addPin(path + ".limit_all_pin", motor?.limit_all_pin, usedPins);
    addPin(path + ".limit_neg_pin", motor?.limit_neg_pin, usedPins);
    addPin(path + ".limit_pos_pin", motor?.limit_pos_pin, usedPins);
    addPin(
        path + ".rc_servo.output_pin",
        motor?.rc_servo?.output_pin,
        usedPins
    );
    addPin(
        path + ".solenoid.output_pin",
        motor?.solenoid?.output_pin,
        usedPins
    );
    addPin(
        path + ".standard_stepper.direction_pin",
        motor?.standard_stepper?.direction_pin,
        usedPins
    );
    addPin(
        path + ".standard_stepper.disable_pin",
        motor?.standard_stepper?.disable_pin,
        usedPins
    );
    addPin(
        path + ".standard_stepper.step_pin",
        motor?.standard_stepper?.step_pin,
        usedPins
    );
    addPin(
        path + ".stepstick.direction_pin",
        motor?.stepstick?.direction_pin,
        usedPins
    );
    addPin(
        path + ".stepstick.disable_pin",
        motor?.stepstick?.disable_pin,
        usedPins
    );
    addPin(path + ".stepstick.ms1_pin", motor?.stepstick?.ms1_pin, usedPins);
    addPin(path + ".stepstick.ms2_pin", motor?.stepstick?.ms2_pin, usedPins);
    addPin(path + ".stepstick.ms3_pin", motor?.stepstick?.ms3_pin, usedPins);
    addPin(
        path + ".stepstick.reset_pin",
        motor?.stepstick?.reset_pin,
        usedPins
    );
    addPin(path + ".stepstick.step_pin", motor?.stepstick?.step_pin, usedPins);
    addPin(path + ".tmc_2130.cs_pin", motor?.tmc_2130?.cs_pin, usedPins);
    addPin(
        path + ".tmc_2130.direction_pin",
        motor?.tmc_2130?.direction_pin,
        usedPins
    );
    addPin(
        path + ".tmc_2130.disable_pin",
        motor?.tmc_2130?.disable_pin,
        usedPins
    );
    addPin(path + ".tmc_2130.step_pin", motor?.tmc_2130?.step_pin, usedPins);

    addPin(
        path + ".tmc_2208.direction_pin",
        motor?.tmc_2208?.direction_pin,
        usedPins
    );
    addPin(
        path + ".tmc_2208.disable_pin",
        motor?.tmc_2208?.disable_pin,
        usedPins
    );
    addPin(path + ".tmc_2208.step_pin", motor?.tmc_2208?.step_pin, usedPins);

    addPin(
        path + ".tmc_2209.direction_pin",
        motor?.tmc_2209?.direction_pin,
        usedPins
    );
    addPin(
        path + ".tmc_2209.disable_pin",
        motor?.tmc_2209?.disable_pin,
        usedPins
    );
    addPin(path + ".tmc_2209.step_pin", motor?.tmc_2209?.step_pin, usedPins);

    addPin(path + ".tmc_5160.cs_pin", motor?.tmc_5160?.cs_pin, usedPins);
    addPin(
        path + ".tmc_5160.direction_pin",
        motor?.tmc_5160?.direction_pin,
        usedPins
    );
    addPin(
        path + ".tmc_5160.disable_pin",
        motor?.tmc_5160?.disable_pin,
        usedPins
    );
    addPin(path + ".tmc_5160.step_pin", motor?.tmc_5160?.step_pin, usedPins);
};

export const getUsedPins = (config: Config) => {
    const usedPins = new Map();
    addPin(
        "axes.shared_stepper_disable_pin",
        config.axes?.shared_stepper_disable_pin,
        usedPins
    );
    addPin(
        "axes.shared_stepper_reset_pin",
        config.axes?.shared_stepper_reset_pin,
        usedPins
    );
    addMotorPins("axes.x.motor0", config.axes?.x?.motor0, usedPins);
    addMotorPins("axes.x.motor1", config.axes?.x?.motor1, usedPins);
    addMotorPins("axes.y.motor0", config.axes?.y?.motor0, usedPins);
    addMotorPins("axes.y.motor1", config.axes?.y?.motor1, usedPins);
    addMotorPins("axes.z.motor0", config.axes?.z?.motor0, usedPins);
    addMotorPins("axes.z.motor1", config.axes?.z?.motor1, usedPins);
    addMotorPins("axes.a.motor0", config.axes?.a?.motor0, usedPins);
    addMotorPins("axes.a.motor1", config.axes?.a?.motor1, usedPins);
    addMotorPins("axes.b.motor0", config.axes?.b?.motor0, usedPins);
    addMotorPins("axes.b.motor1", config.axes?.b?.motor1, usedPins);
    addMotorPins("axes.c.motor0", config.axes?.c?.motor0, usedPins);
    addMotorPins("axes.c.motor1", config.axes?.c?.motor1, usedPins);

    addPin("10V.direction_pin", config["10V"]?.direction_pin, usedPins);
    addPin("10V.enable_pin", config["10V"]?.enable_pin, usedPins);
    addPin("10V.forward_pin", config["10V"]?.forward_pin, usedPins);
    addPin("10V.output_pin", config["10V"]?.output_pin, usedPins);
    addPin("10V.reverse_pin", config["10V"]?.reverse_pin, usedPins);

    addPin("DAC.direction_pin", config.DAC?.direction_pin, usedPins);
    addPin("DAC.enable_pin", config.DAC?.enable_pin, usedPins);
    addPin("DAC.output_pin", config.DAC?.output_pin, usedPins);

    addPin("HBridge.enable_pin", config.HBridge?.enable_pin, usedPins);
    addPin("HBridge.output_ccw_pin", config.HBridge?.output_ccw_pin, usedPins);
    addPin("HBridge.output_cw_pin", config.HBridge?.output_cw_pin, usedPins);

    addPin("Laser.enable_pin", config.Laser?.enable_pin, usedPins);
    addPin("Laser.output_pin", config.Laser?.output_pin, usedPins);

    addPin("PWM.direction_pin", config.PWM?.direction_pin, usedPins);
    addPin("PWM.direction_pin", config.PWM?.enable_pin, usedPins);
    addPin("PWM.output_pin", config.PWM?.output_pin, usedPins);

    addPin("besc.direction_pin", config.besc?.direction_pin, usedPins);
    addPin("besc.enable_pin", config.besc?.enable_pin, usedPins);
    addPin("besc.output_pin", config.besc?.output_pin, usedPins);

    addPin(
        "control.cycle_start_pin",
        config.control?.cycle_start_pin,
        usedPins
    );
    addPin("control.estop_pin", config.control?.estop_pin, usedPins);
    addPin("control.fault_pin", config.control?.fault_pin, usedPins);
    addPin("control.feed_hold_pin", config.control?.feed_hold_pin, usedPins);
    addPin("control.macro0_pin", config.control?.macro0_pin, usedPins);
    addPin("control.macro1_pin", config.control?.macro1_pin, usedPins);
    addPin("control.macro2_pin", config.control?.macro2_pin, usedPins);
    addPin("control.macro3_pin", config.control?.macro3_pin, usedPins);
    addPin("control.reset_pin", config.control?.reset_pin, usedPins);
    addPin(
        "control.safety_door_pin",
        config.control?.safety_door_pin,
        usedPins
    );

    addPin("coolant.flood_pin", config.coolant?.flood_pin, usedPins);
    addPin("coolant.mist_pin", config.coolant?.mist_pin, usedPins);

    addPin("probe.pin", config.probe?.pin, usedPins);
    addPin("probe.toolsetter_pin", config.probe?.toolsetter_pin, usedPins);

    addPin("sdcard.card_detect_pin", config.sdcard?.card_detect_pin, usedPins);
    addPin("sdcard.cs_pin", config.sdcard?.cs_pin, usedPins);

    addPin("spi.miso_pin", config.spi?.miso_pin, usedPins);
    addPin("spi.mosi_pin", config.spi?.mosi_pin, usedPins);
    addPin("spi.sck_pin", config.spi?.sck_pin, usedPins);

    addPin("i2c0.scl_pin", config.i2c0?.scl_pin, usedPins);
    addPin("i2c0.sda_pin", config.i2c0?.sda_pin, usedPins);

    addPin("i2so.bck_pin", config.i2so?.bck_pin, usedPins);
    addPin("i2so.data_pin", config.i2so?.data_pin, usedPins);
    addPin("i2so.ws_pin", config.i2so?.ws_pin, usedPins);

    return usedPins;
};

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

    start?: Start;

    axes?: Axes;

    i2so?: I2ISO;
    i2c0?: I2C0Config;
    spi?: SPI;
    sdcard?: SDCard;
    coolant?: Coolant;
    macros?: Macros;
    probe?: Probe;
    oled?: OLEDConfig;
    control?: ControlConfig;

    "10V"?: SpindleDriver10V;
    besc?: SpindleDriverBesc;
    DAC?: SpindleDriverDAC;
    Huanyang?: SpindleDriverHuanyang;
    YL620?: SpindleDriverYL620;
    NowForever?: SpindleDriverNowForever;
    PWM?: SpindleDriverPWM;
    HBridge?: SpindleDriverHBridge;
    Laser?: SpindleDriverLaser;
    relay?: SpindleDriverRelay;
    NoSpindle?: SpindleDriverNoSpindle;
};

type Start = {
    /**
     * This controls whether you are required to home at startup or not. You will get an homing alarm at startup if this value is true. This prevents motion until you home the machine or clear the alarm.
     */
    must_home?: boolean;

    /**
     * Turns off the parking feature.
     */
    deactivate_parking?: boolean;

    /**
     *  If true this will report if any limit switches are active at startup if hard_limits is true for the axis.
     */
    check_limits?: boolean;
};

export type Axes = {
    shared_stepper_disable_pin?: string;
    shared_stepper_reset_pin?: string;
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
    toolsetter_pin?: string;
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
    toff_coolstep?: number;
    run_mode?: TrinamicMode | string;
    homing_mode?: TrinamicMode | string;
    use_enable?: boolean;
};

type MotorDriverTMC2208 = {
    step_pin?: string;
    direction_pin?: string;
    disable_pin?: string;
    r_sense_ohms?: number;
    run_amps?: number;
    hold_amps?: number;
    microsteps?: number;
};

type MotorDriverTMC2209 = {
    step_pin?: string;
    direction_pin?: string;
    disable_pin?: string;
    uart_num?: number;
    addr?: number;
    r_sense_ohms?: number;
    run_amps?: number;
    hold_amps?: number;
    microsteps?: number;
    stallguard?: number;
    stallguard_debug?: boolean;
    toff_disable?: number;
    toff_stealthchop?: number;
    toff_coolstep?: number;
    run_mode?: TrinamicMode | string;
    homing_mode?: TrinamicMode | string;
    use_enable?: boolean;
};

type MotorDriverTMC5160 = {
    step_pin?: string;
    direction_pin?: string;
    disable_pin?: string;
    cs_pin?: string;
    spi_index?: string;
    r_sense_ohms?: number;
    run_amps?: number;
    hold_amps?: number;
    stallguard?: number;
    stallguard_debug?: boolean;
    toff_disable?: number;
    toff_stealthchop?: number;
    toff_coolstep?: number;
    run_mode?: TrinamicMode | string;
    homing_mode?: TrinamicMode | string;
    use_enable?: boolean;
    tpfd?: number;
};

type MotorDriverRCServo = {
    output_pin?: string;
    pwm_hz?: number;
    min_pulse_us?: number;
    max_pulse_us?: number;
};

type MotorDriverSolenoid = {
    output_pin?: string;
    pwm_hz?: number;
    off_percent?: number;
    pull_percent?: number;
    hold_percent?: number;
    pull_ms?: number;
};

type MotorDriverDynamixel2 = {
    id?: number;
    uart_num?: number;
    count_min?: number;
    count_max?: number;
};

export type SpindleDriver10V = {
    forward_pin?: string;
    reverse_pin?: string;
    pwm_hz?: number;
    output_pin?: string;
    enable_pin?: string;
    direction_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};

export type SpindleDriverBesc = {
    pwm_hz?: number;
    output_pin?: string;
    enable_pin?: string;
    direction_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    min_pulse_us?: number;
    max_pulse_us?: number;
    off_on_alarm?: boolean;
};

export type SpindleDriverDAC = {
    output_pin?: string;
    enable_pin?: string;
    direction_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};
export type SpindleDriverHuanyang = {
    uart?: Uart;
    modbus_id?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: string;
};

export type SpindleDriverYL620 = {
    uart?: Uart;
    modbus_id?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: string;
};

export type SpindleDriverNowForever = {
    uart?: Uart;
    modbus_id?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: string;
};

export type SpindleDriverPWM = {
    pwm_hz?: number;
    output_pin?: string;
    enable_pin?: string;
    direction_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};

export type SpindleDriverHBridge = {
    pwm_hz?: number;
    output_cw_pin?: string;
    output_ccw_pin?: string;
    enable_pin?: string;
    disable_with_s0?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};

export type SpindleDriverLaser = {
    pwm_hz?: number;
    output_pin?: string;
    enable_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};

export type SpindleDriverRelay = {
    direction_pin?: string;
    output_pin?: string;
    enable_pin?: string;
    disable_with_s0?: boolean;
    s0_with_disable?: boolean;
    spinup_ms?: number;
    spindown_ms?: number;
    tool_num?: number;
    speed_map?: string;
    off_on_alarm?: boolean;
};

export type SpindleDriverNoSpindle = {
    description?: string;
};

export type Uart = {
    txd_pin?: string;
    rxd_pin?: string;
    rts_pin?: string;
    baud?: number;
    mode?: string;
};

export type I2C0Config = {
    sda_pin?: string;
    scl_pin?: string;
};

export type OLEDConfig = {
    i2c_num?: number;
    i2c_address: number;
    width?: number;
    height?: number;
    radio_delay_ms: number;
};

export type ControlConfig = {
    safety_door_pin?: string;
    reset_pin?: string;
    feed_hold_pin?: string;
    cycle_start_pin?: string;
    macro0_pin?: string;
    macro1_pin?: string;
    macro2_pin?: string;
    macro3_pin?: string;
    fault_pin?: string;
    estop_pin?: string;
};

export class PinConfig {
    constructor(
        pin: Pin | string,
        pull: PinPull | string,
        active: PinActive | string
    ) {
        this.pin = pin;
        this.pull = pull;
        this.active = active;
    }

    public pin: string;
    public pull: string = PinPull.NONE;
    public active: string = PinActive.HIGH;

    static fromString(pin: string | undefined): PinConfig | undefined {
        if (!pin) {
            return undefined;
        }

        const pinParts = pin.toLocaleLowerCase().split(":");
        let parsedPin: string = Pin.NO_PIN;
        let parsedPinPull: string = PinPull.NONE;
        let parsedPinActive: string = PinActive.HIGH;

        pinParts.forEach((pinPart, index) => {
            if (index === 0) {
                parsedPin = pinPart;
            } else if (pinPart === PinPull.UP || pinPart === PinPull.DOWN) {
                parsedPinPull = pinPart;
            } else if (pinPart === PinActive.LOW) {
                parsedPinActive = pinPart;
            }
        });

        return new PinConfig(parsedPin, parsedPinPull, parsedPinActive);
    }

    toString() {
        let result = this.pin === Pin.NO_PIN ? "NO_PIN" : this.pin;

        if (this.pin !== Pin.NO_PIN) {
            if (this.pull) {
                result += ":" + this.pull;
            }

            if (this.active === PinActive.LOW) {
                result += ":" + this.active;
            }
        }

        return result;
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
