import "mocha";
import { assertUnavailable } from "test/interaction/bed";

describe("旧市街", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("旧市街");
    });
});