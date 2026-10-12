import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("getTournamentMappool", () => {
    it("should return a playlist", async () => {
        const client = new SpinShareClient();
        const response = await client.getTournamentMappool();

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
});