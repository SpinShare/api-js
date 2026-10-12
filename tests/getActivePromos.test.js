import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getActivePromos", () => {
    it("should return an array of promos", async () => {
        const client = new SpinShareClient();

        let response;
        try {
            response = await client.getActivePromos();
        } catch(e) {
            // The server responds with 404 if there are no visible promos
            expect(e).toBeInstanceOf(NotFoundError);
            return;
        }

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
});
