import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getUserCharts", () => {
    it("should return charts of a user by id", async () => {
        const client = new SpinShareClient();
        const id = 4;
        const response = await client.getUserCharts(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
    it("should return an empty array if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getUserCharts(0)).rejects.toThrowError(NotFoundError);
    });
});