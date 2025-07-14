
import { describe, it, expect, vi } from "vitest";
import {NotFoundError, SpinShareClient, UnauthenticatedError} from "../src/index.js";
import axios from "axios";

vi.mock("axios");

describe("connectRemoveReview", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should not throw if review was removed", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 200,
                data: []
            }
        });

        const client = new SpinShareClient();
        const response = await client.connectRemoveReview(correctToken, 1234);

        expect(response).toBeDefined();
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/connect/reviews/1234/remove"),
            expect.objectContaining({
                params: expect.objectContaining({
                    connectToken: correctToken
                })
            })
        );
        vi.clearAllMocks();
    });

    it("should throw 404 if chart does not exist", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 404,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.connectRemoveReview(correctToken, 1234))
            .rejects.toThrowError(NotFoundError);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                version: 1,
                status: 403,
                data: []
            }
        });

        const client = new SpinShareClient();
        await expect(client.connectRemoveReview(wrongToken, 1234))
            .rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});