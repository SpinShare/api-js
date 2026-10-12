import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("getDlcs", () => {
    it("should return a list of DLCs", async () => {
        const client = new SpinShareClient();
        const response = await client.getDlcs();

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
});