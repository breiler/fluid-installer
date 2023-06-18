import { SerialBufferedReader, SerialPort } from "../../utils/serialport/SerialPort";
import { sleep } from "../../utils/utils";
import { XModem, XModemSocket } from "../../utils/xmodem/xmodem";
import { Command, CommandState } from "./Command";
import { PingCommand } from "./PingCommand";

class XModemSocketAdapter implements XModemSocket {
    private serialPort: SerialPort;
    private buffer: Buffer = Buffer.alloc(0);
    private unregister: () => void;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;

        // Registers a reader and store the function for unregistering
        this.unregister = this.serialPort.addReader((data) =>
            this.onData(data)
        );
    }

    onData(data: Buffer) {
        if (!this.buffer) {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([this.buffer, data]);
        }
    }

    write(buffer) {
        return this.serialPort.write(buffer);
    }

    read(): Promise<Buffer> {
        const result = this.buffer;
        this.buffer = Buffer.alloc(0);
        return Promise.resolve(result);
    }

    peekByte(): Promise<number | undefined> {
        return Promise.resolve(this.buffer.at(0));
    }

    close() {
        this.unregister && this.unregister();
    }
}


export enum ControllerStatus {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    UNKNOWN_DEVICE
}

const MAX_PING_COUNT = 10;

export class ControllerService {

    serialPort: SerialPort;
    buffer: string;
    commands: Command[];
    xmodemMode: boolean = false;
    status: ControllerStatus = ControllerStatus.DISCONNECTED;
    currentVersion: string | undefined;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.buffer = "";
        this.commands = [];
    }

    connect = async (): Promise<ControllerStatus> => {
        if (!this.serialPort.isOpen()) {
            console.log("Connecting to serial port...");
            const bufferedReader = new SerialBufferedReader();
            await this.serialPort.open(115200);

            try {
                this.serialPort.addReader(bufferedReader.getReader());
                // Send reset echo mode and reset controller
                await this.serialPort.write(Buffer.from([0x0c, 0x18]));
                const gotWelcomeString = await this.waitForWelcomeString(bufferedReader);                
                await sleep(500);

                if (gotWelcomeString) {
                    // Clear send buffer
                    await this.serialPort.write(Buffer.from("\r\n"));
                    
                    // Clear input buffer
                    await sleep(100);
                    bufferedReader.clear();

                    // Try and query for version
                    await this.serialPort.write(Buffer.from("$I"));
                    await this.serialPort.write(Buffer.from("\r\n"));
                    await sleep(300);
                    let buffer = await bufferedReader.read();
                    console.log(buffer.toString());
                    await sleep(300);
                    buffer = await bufferedReader.read();
                    console.log(buffer.toString());
                    const versionResponse = await (await bufferedReader.readLine(1000).then(buffer => buffer.toString()).catch(() => undefined));
                    console.log(versionResponse);
                    this.currentVersion = versionResponse;
                }
            } finally {
                this.serialPort.removeReader(bufferedReader.getReader());
            }

            this.status = ControllerStatus.CONNECTED;
            this.serialPort.addReader(this.onData);
        }

        return Promise.resolve(this.status);
    };

    private async waitForWelcomeString(bufferedReader: SerialBufferedReader) {
        console.log("Waiting for welcome string");
        const currentTime = Date.now();
        while (currentTime + 10000 > Date.now()) {
            const response = await (await bufferedReader.readLine(200).then(buffer => buffer.toString()).catch(() => undefined));
            if (this.isWelcomeString(response)) {
                // Wait for other messages
                await sleep(200);
                bufferedReader.clear();
                console.log("Found welcome message: " + response);
                return true;
            }
        }

        console.log("Could not detect welcome string");
        return false;
    }

    _detectController = async (): Promise<void> => {
        // Attemt to establish a connection
        let answered = false;
        let pingCount = 0;
        while (!answered) {
            pingCount++;
            try {
                await this.ping();
                return Promise.resolve();
            } catch (error) {
                console.debug("Waiting for response... " + pingCount);
            }
            if (pingCount >= MAX_PING_COUNT) {
                this.status = ControllerStatus.UNKNOWN_DEVICE;
                return Promise.reject("Could not detect controller...");
            }
        }
    }

    ping = async (): Promise<void> => {
        const pingCommand = new PingCommand();
        try {
            await this.send(pingCommand, 1000);
            this.status = ControllerStatus.CONNECTED;
            return Promise.resolve();
        } catch (error) {
            return Promise.reject();
        }
    }

    disconnect = (): Promise<void> => {
        this.serialPort.removeReader(this.onData);
        return this.serialPort.close();
    };

    onData = (data: Buffer) => {
        if (this.xmodemMode) {
            return;
        }

        this.buffer += data.toString().replace(/\r/g, "");

        let endLineIndex = this.buffer.indexOf("\n");
        while (endLineIndex >= 0) {
            const line = this.buffer.substring(0, endLineIndex);
            this.buffer = this.buffer.substring(endLineIndex + 1);
            console.log("<<< " + line);

            if (this.commands.length) {
                this.commands[0].appendLine(line);
                if (this.commands[0].state == CommandState.DONE) {
                    this.commands = this.commands.slice(1);
                }
            }
            endLineIndex = this.buffer.indexOf("\n");
        }
    };

    send = <T extends Command>(command: T, timeoutMs: number = 0): Promise<T> => {
        this.commands.push(command);
        const result = new Promise<T>((resolve, reject) => {
            let timer;
            if (timeoutMs > 0) {
                timer = setTimeout(() => {
                    this._removeCommand(command);
                    reject("Command timed out");
                }, timeoutMs);
            }
            (command as Command).onDone = async () => {
                if (timer) {
                    clearTimeout(timer);
                }
                resolve(command)
            };
        });
        this.serialPort.write(Buffer.from((command as Command).command + "\n"));
        return result;
    };

    _removeCommand = (command: Command) => {
        this.commands = this.commands.filter(c => c !== command);
    }

    downloadFile = async (file: string): Promise<Buffer> => {
        this.xmodemMode = true;
        await this.serialPort.write(Buffer.from("$X\r\n"));
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.write(
            Buffer.from("$Xmodem/Send=" + file + "\r\n")
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        const fileData = await xmodem.receive();
        xmodem.close();
        this.xmodemMode = false;

        return Promise.resolve(fileData);
    };

    uploadFile = async (file: string, fileData: Buffer): Promise<void> => {
        this.xmodemMode = true;
        await this.serialPort.write(Buffer.from("$X\r\n"));
        await new Promise((resolve) => setTimeout(resolve, 300));

        await this.serialPort.write(
            Buffer.from("$Xmodem/Receive=" + file + "\r\n")
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const xmodem = new XModem(new XModemSocketAdapter(this.serialPort));
        await xmodem.send(fileData);
        xmodem.close();
        this.xmodemMode = false;

        await new Promise((resolve) => setTimeout(resolve, 3000));
        return Promise.resolve();
    };

    hardReset = async () => {
        return this.serialPort.hardReset();
    }

    private isWelcomeString(response: string | undefined) {
        return response && (response.startsWith("Grbl ") || response.indexOf(" [FluidNC v") > 0);
    }
}
