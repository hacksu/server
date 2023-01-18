import { ssh, sudo } from './src/scripts';
import { getMembersDelta } from './src/teams';



async function updateSSH() {
    const { added, removed, members, commit } = await getMembersDelta('ssh');
    for (const member of removed) {
        await ssh('disable', member.login.toLowerCase());
    }
    for (const member of added) {
        await ssh('enable', member.login.toLowerCase());
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
}


update();
setInterval(() => {
    update();
}, 60 * 1000)