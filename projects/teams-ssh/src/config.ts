import { cleanEnv, num, str } from 'envalid';
import { App } from '@octokit/app';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { EOL } from 'os';
import chalk from 'chalk';

dotenv.config({
    override: true,
    path: process.cwd() + '/.env',
});
dotenv.config({
    override: true,
    path: process.cwd() + '/.env.local',
});


export const env = cleanEnv(process.env, {
    GITHUB_APP_ID: num(),
    GITHUB_APP_KEY: str(),
    GITHUB_INSTALL_ID: num(),
    GITHUB_ORG: str(),
})

const TEST = process.env?.TEST;

export const __data = resolve(process.cwd(), 'data');
export const __script = resolve(process.cwd(), 'config.ts');
export const __defaultScript = resolve(process.cwd(), 'default.config.ts');

mkdirSync(__data, {
    recursive: true
})

const __appKey = resolve(process.cwd(), env.GITHUB_APP_KEY);
if (!existsSync(__appKey) && !TEST) {
    console.error();
    console.error(chalk.red(`Missing Github App Private Key`));
    console.error();
    console.error([
        `Ensure ${chalk.grey(__appKey)} is present`,
        `This is a private key tied to ${chalk.blue('https://github.com/organizations/hacksu/settings/apps/hacksu-read')}`,
        `You can generate a new private key by clicking  ${chalk.bgGray(' Generate a private key ')}  on the page linked above`,
    ].map(o => ' - ' + o).join(EOL));
    console.error();
    process.exit(1);
}

if (TEST) {
    process.on('uncaughtException', (err) => {
        console.error('caught', err);
    })
}

export const app: App<{
    appId: number,
    privateKey: string,
}> = !TEST ? new App({
    appId: env.GITHUB_APP_ID,
    privateKey: TEST ? '' : readFileSync(__appKey, 'utf8'),
}) : {
    async getInstallationOctokit() {
        return {
            request(route, opts) {
                console.log('request', route, opts);
                let data: any;
                if (opts?.team_slug === 'ssh') {
                    data = JSON.parse(readFileSync(TEST, 'utf8'))['teams']['ssh'];
                }
                if (opts?.team_slug === 'sudo') {
                    data = JSON.parse(readFileSync(TEST, 'utf8'))['teams']['sudo'];
                }
                if (route.endsWith('keys')) {
                    // data = JSON.parse(readFileSync(env.TEST, 'utf8'))?.['keys'];
                    data = [{ key: 'key@' + opts.username }]
                }
                return Promise.resolve({
                    status: 200,
                    data: data, //JSON.stringify(data)
                })
            }
        }
    }
} as any;

export const installation = app.getInstallationOctokit(env.GITHUB_INSTALL_ID)

