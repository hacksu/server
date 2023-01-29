import { constants, access } from 'fs/promises';
import { generateBanner, generateMessageOfTheDay } from './src/banner';
import { ssh, sudo } from './src/scripts';
import { getMembersDelta } from './src/teams';
import { updateZshTheme } from './src/zsh';

function exists(path: string) {
    return access(path, constants.F_OK)
        .then(o => true)
        .catch(o => false);
}


async function updateSSH() {
    const { added, removed, members, commit } = await getMembersDelta('ssh');
    for (const member of removed) {
        await ssh('disable', member.login.toLowerCase());
    }
    for (const member of added) {
        await ssh('enable', member.login.toLowerCase());
    }
    for (const member of members) {
        if (!await exists(`/home/${member.login.toLowerCase()}`)) {
            await ssh('enable', member.login.toLowerCase());
        }
    }
    for (const member of members) {
        try {
            await updateZshTheme(member.login.toLowerCase());
        } catch (err) { }
    }
    await commit();
}

async function updateSudo() {
    const { added, removed, members, commit } = await getMembersDelta('sudo');
    for (const member of removed) {
        await sudo('disable', member.login.toLowerCase());
    }
    for (const member of added) {
        await sudo('enable', member.login.toLowerCase());
    }
    await commit();
}


async function update() {
    await updateSSH();
    await updateSudo();
    await generateBanner(true);
    try {
        await updateZshTheme('root');
    } catch (err) { }
}


update();
setInterval(() => {
    update();
}, 60 * 1000);
// setInterval(() => {
//     generateMessageOfTheDay(true);
// }, 10 * 1000)