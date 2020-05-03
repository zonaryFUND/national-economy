import { assertUnavailable } from "../../bed";

describe("消費財", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("消費財");
    });
});