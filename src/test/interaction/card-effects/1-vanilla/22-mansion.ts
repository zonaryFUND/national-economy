import { assertUnavailable } from "../../bed";

describe("邸宅", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("邸宅");
    });
});