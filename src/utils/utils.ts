export const isSafari = () => {
    return (
        navigator.vendor &&
        navigator.vendor.indexOf("Apple") > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf("CriOS") == -1 &&
        navigator.userAgent.indexOf("FxiOS") == -1
    );
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
    var i,
        len = u8Array.length,
        b_str = "";
    for (i = 0; i < len; i++) {
        b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
};
