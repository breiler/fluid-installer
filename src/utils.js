export const isSafari = () => {
  return (
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    )
  );
};


/**
 * 
 * @param {uint8array} u8Array 
 * @returns 
 */
export const convertUint8ArrayToBinaryString = (u8Array) => {
    var i,
      len = u8Array.length,
      b_str = "";
    for (i = 0; i < len; i++) {
      b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
  };
  