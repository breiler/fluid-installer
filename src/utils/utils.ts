import jsYaml from "js-yaml";
import { Config } from "../model/Config";
import { ControllerFile } from "../services";

export const isSafari = () => {
    return (
        navigator.vendor &&
        navigator.vendor.indexOf("Apple") > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf("CriOS") == -1 &&
        navigator.userAgent.indexOf("FxiOS") == -1
    );
};

export const isFirefox = () => {
    return navigator.userAgent && navigator.userAgent.indexOf("Firefox") > -1;
};

export const checkConnection = async (serialPortDevice) => {
    return serialPortDevice
        .open({ baudRate: 115200 })
        .then(() => serialPortDevice.close());
};

/**
 *
 * @param {uint8array} u8Array
 * @returns
 */
export const convertUint8ArrayToBinaryString = (
    u8Array: Uint8Array
): string => {
    let i;
    const len = u8Array.length;
    let b_str = "";
    for (i = 0; i < len; i++) {
        b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
};

type Props = Record<string, any>; // eslint-disable-line

export const deepMerge = (target: Props, ...sources: Props[]): Props => {
    if (!sources.length) {
        return target;
    }

    Object.entries(sources.shift() ?? []).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            delete target[key];
        } else {
            if (!target[key]) {
                Object.assign(target, { [key]: {} });
            }

            if (
                value.constructor === Object ||
                (value.constructor === Array &&
                    value.find((v) => v.constructor === Object))
            ) {
                deepMerge(target[key], value);
            } else if (value.constructor === Array) {
                Object.assign(target, {
                    [key]: value.find((v) => v.constructor === Array)
                        ? target[key].concat(value)
                        : [...new Set([...target[key], ...value])]
                });
            } else {
                Object.assign(target, { [key]: value });
            }
        }
    });

    return target;
};

export const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const fileDataToConfig = (data): Config => {
    // Workaround for values beginning with # (should not be treated as comments)
    const regexp = /^(\s*.*:[ \t]*)(#\S.*)$/gm;
    const transformedValue = data.replace(regexp, '$1"$2"');
    return jsYaml.load(transformedValue);
};

/**
 * Generates a unique filename based on an config filename.
 *
 * @param files a list of all files
 * @param configFilename the filename that should be created
 * @returns the new file name
 */
export const generateNewFileName = (
    files: ControllerFile[],
    configFilename: string
): string => {
    if (!configFilename.endsWith(".yaml")) {
        configFilename = configFilename + ".yaml";
    }

    let index = 0;
    let newFileName = configFilename;
    while (files.find((file) => file.name === newFileName)) {
        index++;
        newFileName = configFilename.split(".yaml")[0] + index + ".yaml";
    }

    return newFileName;
};
