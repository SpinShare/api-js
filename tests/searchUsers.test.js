import { describe, it, expect } from "vitest";
import {SpinShareClient} from "../src/index.ts";

describe("searchUsers", () => {
    it("should return an array of users", async () => {
        const client = new SpinShareClient();
        const response = await client.searchUsers("thatanimeweirdo");

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeGreaterThan(0);
    });
    it("should return an empty array of users", async () => {
        const client = new SpinShareClient();
        const response = await client.searchUsers("QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM;:_");

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
        expect(response.length).toBeLessThanOrEqual(0);
    });
});