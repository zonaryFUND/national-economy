import "mocha";
import { assertUnavailable } from "test/interaction/bed";

describe("記念碑", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("記念碑");
    });
});