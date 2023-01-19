import { readFile, writeFile } from 'fs/promises';


const theme = readFile(process.cwd() + '/../../scripts/config/robbyrussel.zsh.theme');
export async function updateZshTheme(user: string) {
    const __zsh = user === 'root' ? '/root/.oh-my-zsh' : `/home/${user}/.oh-my-zsh`;
    await writeFile(__zsh + '/themes/robbyrussell.zsh-theme', await theme);
}

