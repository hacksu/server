import _figlet from 'figlet';
import { promisify } from 'util';
import gradient from 'gradient-string';
import { EOL } from 'os';
import chalk from 'chalk';
import { existsSync, writeFileSync } from 'fs';
import { __data } from '.';
import { exec } from './script';
import { execSync } from 'child_process';
import { Transform } from 'stream';
import { Console } from 'console';
import { pm2Status } from './status';

const BLUE = '#4683ff';
const GREEN = '#35c982';

const blue = chalk.hex(BLUE);
const green = chalk.hex(GREEN);
const yellow = chalk.yellow;
const gray = chalk.gray;

const figlet = promisify(_figlet);

export async function generateBanner(commit: boolean = false) {
    // @ts-ignore
    let hacksu: string = await figlet('HacKSU', {
        font: 'Nancyj'
    }) as any;
    hacksu = gradient(BLUE, GREEN).multiline(hacksu);

    await exec(`teams-ssh:update`, `bash ${__dirname}/../sync.sh`);

    // const uptime = await exec(`teams-ssh:uptime`, `pm2 show teams-ssh | grep 'status\|name\|restarts\|uptime\|┐\|─┘' | grep -v 'escribing\|namespace\|unstable' | head -n 6`)
    //     .then(o => o.data.out)
    //     .catch(o => `${yellow('warning')}: teams-ssh is not running!`);

    const msgs = [
        `Details about HacKSU's servers may be found at ${blue('https://github.com/hacksu/server')}` + EOL + ` - Updated at: ${new Date().toLocaleString()}`,
        [
            `Login to this server via your lowercase Github Username`,
            ` - SSH keys are pulled from Github. Use your Github SSH key to authenticate.`,
            ` - SSH access is granted via membership in ${blue('https://github.com/orgs/hacksu/teams/ssh')}`,
            ` - Sudo access is granted via membership in ${blue('https://github.com/orgs/hacksu/teams/sudo')}`,
            ` - Files for hacksu/server are located at ${gray('/root/server')}`,

        ].join(EOL),
        // uptime,
    ].filter(o => o.length > 0);

    const result = EOL.repeat(2)
        + hacksu
        + EOL.repeat(1)
        + msgs.join(EOL + EOL)
        + EOL.repeat(2);

    if (commit) {
        const __banner = __data + '/banner.txt';
        const already = existsSync(__banner);
        writeFileSync(__data + '/banner.txt', result);
        await exec('banner', `sed -i 's/.*Banner.*/Banner ${__banner.split('/').join('\\/')}/g' /etc/ssh/sshd_config`);
        if (!already) {
            await exec('banner.ssh-restart', `service sshd restart`);
        }
    }

    await generateMessageOfTheDay(commit);

    return result;
}

export async function generateMessageOfTheDay(commit: boolean = false) {

    const msgs = [
        `status` + EOL + await pm2Status(),
        [
            // `Login to this server via your lowercase Github Username`,
            // ` - SSH keys are pulled from Github. Use your Github SSH key to authenticate.`,
            // ` - SSH access is granted via membership in ${blue('https://github.com/orgs/hacksu/teams/ssh')}`,
            // ` - Sudo access is granted via membership in ${blue('https://github.com/orgs/hacksu/teams/sudo')}`,
            // ` - Files for hacksu/server are located at ${gray('/root/server')}`,

        ].join(EOL),
    ].filter(o => o.length > 0);

    const result = EOL.repeat(2)
        + msgs.join(EOL + EOL)
        + EOL.repeat(2);

    if (commit) {
        const __motd = __data + '/motd.txt';
        const already = existsSync(__motd);
        writeFileSync(__data + '/motd.txt', result);
        writeFileSync('/etc/motd', result);
        if (!already) {
            await exec('banner.ssh-restart', `service sshd restart`);
        }
    }

    return result;
}


// generateBanner().then(o => console.log(o));

