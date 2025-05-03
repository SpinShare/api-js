import axios from "axios";

export class SpinShareClient {
    apiBase = "https://spinsha.re/api";

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
     * Get's the latest version of the SpinShare Client for a set platform.
     * @param {string} platform
     * @returns {Promise<Object>}
     */
    async getClientLatestVersion(platform) {
        const apiUrl = `${this.apiBase}/latestVersion/${platform}`;
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
            responseType: 'arraybuffer'
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
        const apiUrl = `${this.apiBase}/connect/getNotifications`;
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
            useFormData: true,
            recommended: recommended ? 1 : 0,
            comment: comment,
        });
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
            `This API requires a connect token and an api key and it was not provided or invalid`
        )
        if(response.status !== 200 && response.status !== undefined) throw new ApiStatusError(
            `Unexpected status code: ${response.status}, expected 200`
        )
        if(response.status === 200) {
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

export const NOTIFICATION_TYPE_SYSTEM = 0;
export const NOTIFICATION_TYPE_NEWREVIEW = 1;
export const NOTIFICATION_TYPE_NEWSPINPLAY = 2;
export const NOTIFICATION_TYPE_RECEIVEDCARD = 3;