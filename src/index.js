import axios from "axios";

export class SpinShareClient {
    apiBase = "https://spinsha.re/api";
    dlcHash = null;

    /**
     * @param {object} [options] - Options
     * @param {string} [options.dlcHash] - DLC hash sent as SPSH-DLC-Hash when downloading DLC charts.
     */
    constructor({ dlcHash = null } = {}) {
        this.dlcHash = dlcHash;
    }

    /**
     * @param {string} newApiBase
     * @return {void}
     */
    setApiBase(newApiBase) {
        this.apiBase = newApiBase;
    }

    /**
     * Returns charts based on the searchQuery provided.
     * @param {string} searchQuery - The search term or keywords to find matching charts.
     * @param {object} options - Options
     * @param {boolean} options.diffEasy - Whether to include charts with the "Easy" difficulty.
     * @param {boolean} options.diffNormal - Whether to include charts with the "Normal" difficulty.
     * @param {boolean} options.diffHard - Whether to include charts with the "Hard" difficulty.
     * @param {boolean} options.diffExpert - Whether to include charts with the "Expert" difficulty.
     * @param {boolean} options.diffXD - Whether to include charts with the "XD" difficulty.
     * @param {number} options.diffRatingFrom - The minimum rating value to filter the charts.
     * @param {number} options.diffRatingTo - The maximum rating value to filter the charts.
     * @param {boolean} options.showExplicit - Whether to include explicit content in the results.
     * @return {Promise<Array>} A promise that resolves to an array of charts matching the search criteria.
     */
    async searchCharts(searchQuery, options = {}) {
        const apiUrl = `${this.apiBase}/searchCharts`;
        const response = await this.#postOpen(apiUrl, {
            searchQuery,
            ...options
        });

        return response.data;
    }

    /**
     * Returns playlists based on the searchQuery provided.
     * @param searchQuery
     * @returns {Promise<Object>}
     */
    async searchPlaylists(searchQuery){
        const apiUrl = `${this.apiBase}/searchPlaylists`;
        const response = await this.#postOpen(apiUrl, {
            searchQuery,
        });

        return response.data;
    }

    /**
     * Returns users based on the searchQuery provided.
     * @param searchQuery
     * @returns {Promise<*>}
     */
    async searchUsers(searchQuery){
        const apiUrl = `${this.apiBase}/searchUsers`;
        const response = await this.#postOpen(apiUrl, {
            searchQuery,
        });

        return response.data;
    }

    /**
     * Returns the 12 newest songs. Use offset for pagination.
     * @param offset
     * @returns {Promise<*>}
     */
    async getNewCharts(offset) {
        const apiUrl = `${this.apiBase}/songs/new/${offset}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns 12 songs that were last updated. Use offset for pagination.
     * @param offset
     * @returns {Promise<*>}
     */
    async getUpdatedCharts(offset) {
        const apiUrl = `${this.apiBase}/songs/updated/${offset}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns the 12 most popular songs from the last 7 days. Use offset for pagination.
     * @param offset
     * @returns {Promise<*>}
     */
    async getHotThisWeekCharts(offset) {
        const apiUrl = `${this.apiBase}/songs/hotThisWeek/${offset}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns the 12 most popular songs from the last month. Use offset for pagination.
     * @param offset
     * @returns {Promise<*>}
     */
    async getHotThisMonthCharts(offset) {
        const apiUrl = `${this.apiBase}/songs/hotThisMonth/${offset}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Checks whether the API is reachable.
     * @returns {Promise<boolean>}
     */
    async ping() {
        const apiUrl = `${this.apiBase}/ping`;
        const response = await this.#getOpen(apiUrl, {});

        return response.pong;
    }

    /**
     * Returns the 2 newest visible promos.
     * @returns {Promise<Array>}
     */
    async getPromos() {
        const apiUrl = `${this.apiBase}/promos`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns the status of the SpinShare Twitch stream.
     * @returns {Promise<{title: string, viewers: number, isLive: boolean}>}
     */
    async getStreamStatus() {
        const apiUrl = `${this.apiBase}/streamStatus`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all active promos.
     * @returns {Promise<Array>}
     */
    async getActivePromos() {
        const apiUrl = `${this.apiBase}/activePromos`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns more detailed information about a chart.
     * @param chartIdOrReference
     * @returns {Promise<*>}
     */
    async getChartDetail(chartIdOrReference) {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all active reviews of a song.
     * @param chartIdOrReference
     * @returns {Promise<*>}
     */
    async getChartReviews(chartIdOrReference) {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/reviews`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all active SpinPlays of a song.
     * @param chartIdOrReference
     * @returns {Promise<*>}
     */
    async getChartSpinPlays(chartIdOrReference) {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/spinplays`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all playlists that includes a song.
     * @param chartIdOrReference
     * @returns {Promise<*>}
     */
    async getChartPlaylists(chartIdOrReference) {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/playlists`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Generates a download zip and returns it.
     * @param chartIdOrReference
     * @returns {Promise<*>}
     */
    async getChartDownload(chartIdOrReference) {
        const apiUrl = `${this.apiBase}/song/${chartIdOrReference}/download`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            headers: this.dlcHash ? { 'SPSH-DLC-Hash': this.dlcHash } : {},
        });

        // Parse the buffer as JSON on error
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const textDecoder = new TextDecoder('utf-8');
            const jsonText = textDecoder.decode(response.data);
            const jsonResponse = JSON.parse(jsonText);
            this.#checkResponse(jsonResponse);
            return jsonResponse;
        }

        return response.data;

    }

    /**
     * Returns the current update hashes of multiple charts at once. Charts that can't be found are omitted.
     * @param {Array<number|string>} chartIdsOrReferences - Up to 500 chart IDs and/or file references.
     * @returns {Promise<Array<{id: number, fileReference: string, updateHash: string}>>}
     */
    async getChartUpdateHashes(chartIdsOrReferences) {
        const apiUrl = `${this.apiBase}/updateHashes`;
        const response = await this.#postOpen(apiUrl, {
            charts: chartIdsOrReferences,
        });

        return response.data;
    }

    /**
     * Checks whether the given update hashes match the current versions of multiple charts.
     * @param {Array<{chart: number|string, updateHash: string}>} charts - Up to 500 chart/updateHash pairs.
     * @returns {Promise<Array<{chart: number|string, isUpToDate: boolean}>>}
     */
    async checkChartUpdateHashes(charts) {
        const apiUrl = `${this.apiBase}/updateHashes/check`;
        const response = await this.#postOpen(apiUrl, {
            charts,
        });

        return response.data;
    }

    /**
     * Returns more detailled information about a playlist.
     * @param playlistId
     * @returns {Promise<*>}
     */
    async getPlaylistDetail(playlistId) {
        const apiUrl = `${this.apiBase}/playlist/${playlistId}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns a general overview of information about a user.
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserDetail(userId) {
        const apiUrl = `${this.apiBase}/user/${userId}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all public charts of a user.
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserCharts(userId) {
        const apiUrl = `${this.apiBase}/user/${userId}/charts`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all playlists of a user.
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserPlaylists(userId) {
        const apiUrl = `${this.apiBase}/user/${userId}/playlists`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all reviews of a user.
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserReviews(userId) {
        const apiUrl = `${this.apiBase}/user/${userId}/reviews`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns all SpinPlays of a user.
     * @param userId
     * @returns {Promise<*>}
     */
    async getUserSpinPlays(userId) {
        const apiUrl = `${this.apiBase}/user/${userId}/spinplays`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns the mappool of the current tournament.
     * @returns {Promise<*>}
     */
    async getTournamentMappool() {
        const apiUrl = `${this.apiBase}/tournament/mappool`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns a list of all DLCs
     * @returns {Promise<*>}
     */
    async getDlcs() {
        const apiUrl = `${this.apiBase}/dlc`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    /**
     * Returns the DLC of a DLC MD5 hash if it is valid or a 404 response if it is invalid
     * @param dlcHash
     * @returns {Promise<*>}
     */
    async verifyDlcHash(dlcHash) {
        const apiUrl = `${this.apiBase}/dlc/verify/${dlcHash}`;
        const response = await this.#getOpen(apiUrl, {});

        return response.data;
    }

    async connectGetToken(apiKey, code) {
        const apiUrl = `${this.apiBase}/connect/getToken`;
        const response = await this.#getOpen(apiUrl, {
            connectAppApiKey: apiKey,
            connectCode: code,
        });

        return response.data;
    }
    async connectValidateToken(token) {
        const apiUrl = `${this.apiBase}/connect/validateToken`;

        try {
            await this.#getConnect(apiUrl, token, {});
            return true;
        } catch(e) {
            return false;
        }
    }

    async connectGetProfile(token) {
        const apiUrl = `${this.apiBase}/connect/profile`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }
    async connectGetPlaylists(token) {
        const apiUrl = `${this.apiBase}/connect/playlists`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }

    async connectGetNotifications(token) {
        const apiUrl = `${this.apiBase}/connect/notifications`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }
    async connectClearNotification(token, notificationId) {
        const apiUrl = `${this.apiBase}/connect/clearNotification`;
        const response = await this.#getConnect(apiUrl, token, {
            notificationID: notificationId,
        });

        return response.data;
    }
    async connectClearAllNotifications(token) {
        const apiUrl = `${this.apiBase}/connect/clearAllNotifications`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }

    async connectGetReview(token, chartId) {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/get`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }
    async connectAddReview(token, chartId, recommended, comment) {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/add`;
        const response = await this.#postConnect(apiUrl, token, {
            recommended: !!recommended,
            comment: comment,
        });
        return response.data;
    }
    async connectRemoveReview(token, chartId) {
        const apiUrl = `${this.apiBase}/connect/reviews/${chartId}/remove`;
        const response = await this.#getConnect(apiUrl, token, {});

        return response.data;
    }

    async #getOpen(endpoint, params) {
        const response = await axios.get(endpoint, {
            params: params,
        });
        this.#checkResponse(response.data);

        return response.data;
    }

    async #postOpen(endpoint, body, params) {
        const response = await axios.post(endpoint, JSON.stringify(body), {
            params: {
                ...params,
            }
        });
        this.#checkResponse(response.data);

        return response.data;
    }

    async #getConnect(endpoint, token, params) {
        const response = await axios.get(endpoint, {
            params: {
                connectToken: token,
                ...params
            },
        });
        this.#checkResponse(response.data);

        return response.data;
    }

    async #postConnect(endpoint, token, body, params) {
        const isFormData = body && typeof body === 'object' && body.useFormData;
        let requestBody;
        if(isFormData) {
            requestBody = new FormData();
            for(const key in body) {
                requestBody.append(key, body[key]);
            }
        } else {
            requestBody = JSON.stringify(body);
        }
        const contentType = isFormData ? 'application/x-www-form-urlencoded' : 'application/json';

        const response = await axios.post(endpoint, requestBody, {
            headers: {
                'Content-Type': contentType,
            },
            params: {
                connectToken: token,
                ...params,
            },
        });
        this.#checkResponse(response.data);

        return response;
    }

    #checkResponse(response) {
        if(response.status === 404) throw new NotFoundError(
            `Not Found`
        )
        if(response.status === 403) throw new UnauthenticatedError(
            `Access denied: missing or invalid connect token, API key or DLC hash`
        )
        if(response.status === 400 || response.status === 422) throw new ValidationError(
            `Invalid request or missing parameter`
        )
        if(response.status === 500) throw new ServerError(
            `Internal server error`
        )
        if(response.status !== 200 && response.status !== 201 && response.status !== undefined) throw new ApiStatusError(
            `Unexpected status code: ${response.status}, expected 200`
        )
        if(response.status === 200 || response.status === 201) {
            if (response.version !== 1) throw new ApiMismatchError(
                `Unsupported Version: ${response.version}`
            )
        }
    }
}

export class ApiMismatchError extends Error {}
export class NotFoundError extends Error {}
export class UnauthenticatedError extends Error {}
export class ApiStatusError extends Error {}
export class ServerError extends Error {}
export class ValidationError extends Error {}

export const NOTIFICATION_TYPE_SYSTEM = 0;
export const NOTIFICATION_TYPE_NEWREVIEW = 1;
export const NOTIFICATION_TYPE_NEWSPINPLAY = 2;
export const NOTIFICATION_TYPE_RECEIVEDCARD = 3;