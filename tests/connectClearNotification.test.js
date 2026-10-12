import { describe, it, expect, vi } from "vitest";
import {
    NotFoundError,
    SpinShareClient,
    UnauthenticatedError
} from "../src/index.ts";
import axios from "axios";

vi.mock("axios");

describe("connectGetNotifications", () => {
    const correctToken = "CORRECT-TOKEN";
    const wrongToken = "WRONG-TOKEN";

    it("should not throw if notification was cleared", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {"version":1,"status":200,"data":[]} });

        const client = new SpinShareClient();
        const response = await client.connectClearNotification(correctToken, 1234);
        expect(response).toBeDefined();
        vi.clearAllMocks();
    });

    it("should throw 404 if notification does not exist", async () => {
        axios.get.mockResolvedValueOnce({status: 200, data: {"version":1,"status":404,"data":[]} });

        const client = new SpinShareClient();
        await expect(client.connectClearNotification(correctToken, 1234)).rejects.toThrowError(NotFoundError);
        vi.clearAllMocks();
    });

    it("should throw 403 if token is invalid", async () => {
        axios.get.mockResolvedValueOnce({status: 403, data: {
                "version":1,
                "status":403,
                "data":[]
            } });

        const client = new SpinShareClient();
        await expect(client.connectClearNotification(wrongToken, 1000)).rejects.toThrowError(UnauthenticatedError);
        vi.clearAllMocks();
    });
});