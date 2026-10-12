import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.js";

describe("ping", () => {
    it("should return true", async () => {
        const client = new SpinShareClient();
        const response = await client.ping();

        expect(response).toBe(true);
    });
});
