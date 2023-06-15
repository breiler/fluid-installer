/**
 * Typings for the serial port defined here:
 * https://developer.mozilla.org/en-US/docs/Web/API/SerialPort/
 */

export type NativeOpenOptions = {
    baudRate: number;
    bufferSize?: number;
};

export type NativeSerialPortInfo = {
    usbVendorId: number;
    usbProductId: number;
};

export type NativeSerialSignalOptions = {
    dataTerminalReady?: boolean;
    requestToSend?: boolean;
    break?: boolean;
}

export type NativeEventFunction = (event: Event) => void;

export enum NativeSerialPortEvent {
    CONNECT = "connect",
    DISCONNECT = "disconnect"
}

export type NativeSerialPort = {
    readable?: ReadableStream<Uint8Array>;
    writable?: WritableStream<Uint8Array>;
    open: (options: NativeOpenOptions) => Promise<void>;
    close: () => Promise<void>;
    getInfo: () => NativeSerialPortInfo;
    addEventListener: (NativeSerialPortEvent, NativeEventFunction) => void;
    setSignals: (options: NativeSerialSignalOptions) => Promise<void>;
    getSignals: () => Promise<NativeSerialSignalOptions>;
};
