import { $ } from 'bun';

export function buildScript<T extends { [key: string]: (...args: any[]) => any }>(scripts: T) {
    return function <K extends keyof T>(script: K, ...args: Parameters<T[K]>): ReturnType<T[K]> {
        return scripts[script](...args)
    }
}

export async function exec(label: string, cmd: string) {
    console.log('exec', { label, cmd });
    return await $`${cmd}`.quiet().text();
}