import { generateBanner } from './src/banner';
import { ssh, sudo } from './src/scripts';
import { getMembersDelta } from './src/teams';
import { updateZshTheme } from './src/zsh';



async function updateSSH() {
    const { added, removed, members, commit } = await getMembersDelta('ssh');
    console.log(added, removed);
    for (const member of removed) {
        await ssh('disable', member.login.toLowerCase());
    }
    for (const member of added) {
        await ssh('enable', member.login.toLowerCase());
    }
    for (const member of members) {
        try {
            await updateZshTheme(member.login.toLowerCase());
        } catch (err) {

        }
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
    await updateZshTheme('root');
}


update();
setInterval(() => {
    update();
}, 60 * 1000)