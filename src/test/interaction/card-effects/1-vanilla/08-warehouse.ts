import { assertUnavailable } from "../../bed";

describe("倉庫", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("倉庫");
    });
});