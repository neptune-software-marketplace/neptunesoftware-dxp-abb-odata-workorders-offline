/**
 * Example test file after deployment.
 */

import axios from "axios";
import * as https from 'https';

const serverUrl = process.env.DXP_OE_SERVER_URL;
const serverToken = process.env.DXP_OE_SERVER_TOKEN;

const healtzUrl = (server: string) => `${server}/healthz`;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

async function axiosGet(url: string, config: Record<string, unknown> = {}) {
    return axios.get(url, { httpsAgent, headers: {
            'Authorization': `Bearer ${serverToken}`,
        }, ...config});
}

describe(`Running test script after deployment to ${serverUrl}`, () => {

    test('Server healtz', async () => {
        const response = await axiosGet(healtzUrl(serverUrl));
        expect(response.status).toBe(200);
    });

    /**
     * More tests...
     */
});
