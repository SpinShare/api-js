import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.js";

describe("getPromos", () => {
    it("should return an array of up to 2 promos", async () => {
        const client = new SpinShareClient();

        let response;
        try {
            response = await client.getPromos();
        } catch(e) {
            // The server responds with 404 if there are no visible promos
            expect(e).toBeInstanceOf(NotFoundError);
            return;
        }

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeLessThanOrEqual(2);
    });
});
