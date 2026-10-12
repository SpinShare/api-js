import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getChartReviews", () => {
    it("should return reviews by id", async () => {
        const client = new SpinShareClient();
        const id = 1904;
        const response = await client.getChartReviews(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.reviews).toBeInstanceOf(Array);
    });
    it("should return reviews by reference", async () => {
        const client = new SpinShareClient();
        const fileReference = "spinshare_5fd014fe4afe7";
        const response = await client.getChartReviews(fileReference);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response.reviews).toBeInstanceOf(Array);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getChartReviews(0)).rejects.toThrowError(NotFoundError);
    });
});