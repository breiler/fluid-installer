import React from "react";
import { SerialPort } from "../utils/serialport/SerialPort";

export const SerialPortContext = React.createContext<SerialPort|undefined>(undefined);

