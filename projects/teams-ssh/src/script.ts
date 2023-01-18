import { ChildProcess, exec as _exec, spawn } from 'child_process'
import { promisify } from 'util'
import prepend from 'prepend-transform';

export function buildScript<T extends { [key: string]: (...args: any[]) => any }>(scripts: T) {
    return function <K extends keyof T>(script: K, ...args: Parameters<T[K]>): ReturnType<T[K]> {
        return scripts[script](...args)
    }
}


const execp = promisify(_exec);

export function exec(label: string, cmd: string) {
    console.log('exec', { label, cmd });
    const proc = _exec(cmd, {

    });
    const pt = prepend(label + ': \t');
    proc.stdout?.pipe(pt).pipe(process.stdout);
    proc.stderr?.pipe(pt).pipe(process.stderr);
    return new Promise<ChildProcess>((resolve, reject) => {
        proc.on('error', err => reject(err));
        proc.on('close', (code) => {
            if (code && code !== 0)
                return reject(new Error(`Exit Code: ${code}`));
            resolve(proc);
        })
    })
    // const proc = spawn('bash', ['-c', `'${cmd}'`], {
    //     stdio: 'inherit'
    // })
    // return new Promise<ChildProcess>((resolve, reject) => {
    //     proc.on('error', err => reject(err));
    //     proc.on('close', (code) => {
    //         if (code && code !== 0)
    //             return reject(new Error(`Exit Code: ${code}`));
    //         resolve(proc);
    //     })
    // })
}
