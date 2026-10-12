import { describe, it, expect, vi } from "vitest";
import {NotFoundError, SpinShareClient, UnauthenticatedError} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetReview", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should return profile if token is valid", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
                "version":1,
                "status":200,
                "data":{
                    "id": 1,
                    "song": {}
                }
            }
        });

        const client = new SpinShareClient();
        const review = await client.connectGetReview(correctToken, 1);

        expect(review).toBeDefined();
        expect(review.id).toBe(1);
        vi.clearAllMocks();
    });

    it("should throw 404 if chart does not exist", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {
                "version":1,
                "status":404,
                "data":[]
            } });

        const client = new SpinShareClient();
        await expect(client.connectGetProfile(wrongToken)).rejects.toThrowError(NotFoundError);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 403, data: {
                "version":1,
                "status":403,
                "data":[]
            } });

        const client = new SpinShareClient();
        await expect(client.connectGetProfile(wrongToken)).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});