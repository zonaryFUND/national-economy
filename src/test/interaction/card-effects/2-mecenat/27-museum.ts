import "mocha";
import { assertUnavailable } from "test/interaction/bed";

describe("博物館", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("博物館");
    });
});