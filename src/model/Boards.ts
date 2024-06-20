import { Pin, PinDefinition } from "./Config";

export type Board = {
    name: string;
    pins: PinDefinition[];
};

export const Boards: Board[] = [
    {
        name: "6 Pack",
        pins: [
            {
                pin: Pin.NO_PIN,
                input: true,
                pull: false,
                output: true,
                restricted: false
            },
            {
                pin: Pin.GPIO_0,
                input: true,
                pull: true,
                output: true,
                restricted: true,
                comment:
                    "This is used for the bootloader (Usable, but for experts only)"
            },
            {
                pin: Pin.GPIO_1,
                input: false,
                pull: true,
                output: false,
                restricted: true,
                comment: "Used for USB/Serial Data"
            },
            {
                pin: Pin.GPIO_2,
                input: true,
                pull: true,
                output: true,
                comment:
                    "Some dev boards have an LED on this. It does not work well as an input if this is the case because the LED affects the voltage on the pin."
            },
            {
                pin: Pin.GPIO_3,
                input: false,
                pull: true,
                output: false,
                restricted: true,
                comment: "Used for USB/Serial Data"
            },
            {
                pin: Pin.GPIO_4,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_5,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_6,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_7,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_8,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_9,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_10,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_11,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "Use for External Flash"
            },
            {
                pin: Pin.GPIO_12,
                input: true,
                pull: false,
                output: true,
                restricted: false,
                comment: "It is a strapping pin."
            },
            {
                pin: Pin.GPIO_13,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_14,
                input: true,
                pull: true,
                output: true,
                comment: "Some pulses at boot"
            },
            {
                pin: Pin.GPIO_15,
                input: true,
                pull: true,
                output: true,
                comment: "Some pulses at boot"
            },
            {
                pin: Pin.GPIO_16,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_17,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_18,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_19,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_20,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_21,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_22,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_23,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_24,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_25,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_26,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_27,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_28,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_29,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_30,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_31,
                input: false,
                pull: false,
                output: false,
                restricted: true,
                comment: "This is not available on ESP32"
            },
            {
                pin: Pin.GPIO_32,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_33,
                input: true,
                pull: true,
                output: true
            },
            {
                pin: Pin.GPIO_34,
                input: true,
                pull: false,
                output: false
            },
            {
                pin: Pin.GPIO_35,
                input: true,
                pull: false,
                output: false
            },
            {
                pin: Pin.GPIO_36,
                input: true,
                pull: false,
                output: false
            },
            {
                pin: Pin.GPIO_37,
                input: true,
                pull: false,
                output: false,
                restricted: true,
                comment: "not typically available"
            },
            {
                pin: Pin.GPIO_38,
                input: true,
                pull: false,
                output: false,
                restricted: true,
                comment: "not typically available"
            },
            {
                pin: Pin.GPIO_39,
                input: true,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_0,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_1,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_2,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_3,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_4,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_5,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_6,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_7,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_8,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_9,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_10,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_11,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_12,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_13,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_14,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_15,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_16,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_17,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_18,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_19,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_20,
                input: false,
                pull: false,
                output: false
            },
            {
                pin: Pin.I2SO_21,
                input: false,
                pull: false,
                output: false
            }
        ]
    }
];
