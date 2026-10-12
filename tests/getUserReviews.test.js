import { describe, it, expect } from "vitest";
import {NotFoundError, SpinShareClient} from "../src/index.ts";

describe("getUserReviews", () => {
    it("should return reviews by id", async () => {
        const client = new SpinShareClient();
        const id = 4;
        const response = await client.getUserReviews(id);

        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Array);
    });
    it("should return 404 if not found", async () => {
        const client = new SpinShareClient();
        await expect(client.getUserReviews(0)).rejects.toThrowError(NotFoundError);
    });
});