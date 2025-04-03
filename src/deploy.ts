/**
 * Example deployment file.
 */

import axios from "axios";
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';

const serverUrl = process.env.DXP_OE_SERVER_URL;
const serverToken = process.env.DXP_OE_SERVER_TOKEN;
const githubToken = process.env.GITHUB_TOKEN;

const deleteUrl = (server: string) => `${server}/api/functions/Package/DelPackageAndArtifacts`
const cloneUrl = (server: string) => `${server}/api/functions/Package/CloneRepository`;
const getUrl = (server: string) => `${server}/api/functions/Package/Get`;
const importUrl = (server: string) => `${server}/api/functions/Package/ImportRepository`;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

async function axiosPost(url: string, data: unknown, config: Record<string, unknown> = {}) {
    return axios.post(url, data, { httpsAgent, headers: {
            'Authorization': `Bearer ${serverToken}`,
        }, ...config});
}

async function readFile(
    path: fs.PathLike,
    options?: { encoding?: BufferEncoding; flag?: string } | BufferEncoding,
): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

async function readPackageFile() {
    const content = await readFile(path.join(path.join(process.cwd(), 'artifacts'), 'dev_package.json'), 'utf-8') as string;
    return JSON.parse(content);
}

async function getPackageFromServer(id: string): Promise<boolean> {
    try {
        await axiosPost(getUrl(serverUrl), { id });
        return true;
    } catch (e) {
        if (e.response.status === 404) {
            return false;
        }
        console.error('Error getting package from server');
        throw e;
    }
}

(async () => {
    try {
        const devPackage = await readPackageFile();
        const id = devPackage.id;
        const url = devPackage.git.remote;

        const packageExists = await getPackageFromServer(id);
        if (!packageExists) {
            console.log('Package does not exist on server, cloning...');
            const cloneResult = await axiosPost(cloneUrl(serverUrl), {url, auth: {authType: 1, token: githubToken}});
            console.log('Package has been cloned on server');
            const errorLog = cloneResult.data.importLog.data.filter(entry => entry.transferStatus === 'Error');
            if (errorLog.length > 0) {
                console.warn(`One or more artifacts failed to deploy`, errorLog);
            }
            return process.exit(0);
        }

        console.log('Package exists on server, importing...');
        const importResult = await axiosPost(importUrl(serverUrl), {id, branch: 'master', auth: {authType: 1, token: githubToken}, forceUpdate: true});
        console.log('Package has been imported on server');
        const errorLog = importResult.data.importLog.data.filter(entry => entry.transferStatus === 'Error');
        if (errorLog.length > 0) {
            console.warn(`One or more artifacts failed to deploy`, errorLog);
        }

    } catch (e) {
        console.error('Failed to deploy package', e);
    }
    process.exit(0);
})();
