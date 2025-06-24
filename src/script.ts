import { ChildProcess, exec as _exec, spawn } from 'child_process'
import { promisify } from 'util'
import prepend from 'prepend-transform';
import { PassThrough } from 'stream';

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
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    proc.stdout?.pipe(stdout)?.pipe(pt).pipe(process.stdout);
    proc.stderr?.pipe(stdout)?.pipe(pt).pipe(process.stderr);
    return new Promise<ChildProcess & {
        data: {
            out: string,
            err: string,
        }
    }>((resolve, reject) => {
        proc.on('error', err => reject(err));
        proc.on('close', async (code) => {
            if (code && code !== 0)
                return reject(new Error(`Exit Code: ${code}`));
            resolve(Object.assign(proc, {
                data: {
                    out: await streamToString(stdout),
                    err: await streamToString(stderr),
                }
            }) as any);
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


async function streamToString(stream) {
    return await Promise.race([_streamToString(stream), new Promise<string>(resolve => {
        setTimeout(() => {
            console.error('stream timeout');
            resolve('');
        }, 1000)
    })]);
}

async function _streamToString(stream) {
    // lets have a ReadableStream as a stream variable
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf8");
}