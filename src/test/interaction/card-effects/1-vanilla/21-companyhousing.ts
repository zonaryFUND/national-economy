import { assertUnavailable } from "../../bed";

describe("社宅", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("社宅");
    });
});