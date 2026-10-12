import { describe, it, expect, vi } from "vitest";
import {NotFoundError, SpinShareClient, UnauthenticatedError, ValidationError} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectAddReview", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should not throw if review was added", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 200,
                data: []
            }
        });

        const client = new SpinShareClient();
        const response = await client.connectAddReview(correctToken, 1234, true, "Test review");

        expect(response).toEqual([]);
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/connect/reviews/1234/add"),
            {
                recommended: true,
                comment: "Test review"
            },
            expect.objectContaining({ params: { connectToken: correctToken } })
        );
        vi.clearAllMocks();
    });

    it("should not throw if a new review was created", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 201,
                data: []
            }
        });

        const client = new SpinShareClient();
        const response = await client.connectAddReview(correctToken, 1234, true, "Test review");

        expect(response).toBeDefined();
        vi.clearAllMocks();
    });

    it("should throw 422 if a parameter is missing", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 422,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.connectAddReview("", 1234, true, "Test review"))
            .rejects.toThrowError(ValidationError);
        vi.clearAllMocks();
    });

    it("should throw 404 if chart does not exist", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 404,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.connectAddReview(correctToken, 1234, true, "Test review"))
            .rejects.toThrowError(NotFoundError);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 403,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.connectAddReview(wrongToken, 1234, true, "Test review"))
            .rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});