import { cleanEnv, num, str } from 'envalid';
import { App } from '@octokit/app';
import { mkdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

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

export const __data = resolve(process.cwd(), 'data');
export const __script = resolve(process.cwd(), 'config.ts');
export const __defaultScript = resolve(process.cwd(), 'default.config.ts');

mkdirSync(__data, {
    recursive: true
})

export const app = new App({
    appId: env.GITHUB_APP_ID,
    privateKey: readFileSync(resolve(process.cwd(), env.GITHUB_APP_KEY), 'utf8'),
});

export const installation = app.getInstallationOctokit(env.GITHUB_INSTALL_ID)

