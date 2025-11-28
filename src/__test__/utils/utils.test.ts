import { test, expect } from "@jest/globals";
import { fileDataToConfig } from "../../utils/utils";

test("fileDataToConfig should convert a yaml to an object", () => {
    const data = 'key1: 1234\nkey2: "test"';
    const config = fileDataToConfig(data);
    expect(config).toEqual({ key1: 1234, key2: "test" });
});

test("fileDataToConfig should treat hash comments as a value", () => {
    const data = 'key1: #1234\nkey2: "test"';
    const config = fileDataToConfig(data);
    expect(config).toEqual({ key1: "#1234", key2: "test" });
});

test("fileDataToConfig should not treat exponent values as numeric", () => {
    const data = 'key1: 8E1\nkey2: "test"';
    const config = fileDataToConfig(data);
    expect(config).toEqual({ key1: "8E1", key2: "test" });
});
