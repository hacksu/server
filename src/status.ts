import { execSync } from 'child_process';
import { Console } from 'console';
import { Transform } from 'stream';

function table(input) {
    // @see https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, _, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts, colorMode: 'auto' })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    }
    return result;
}

const ASCII_COLORS = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
const stripColors = (input: string) => input.replace(ASCII_COLORS, '');

export async function dockerComposeStatus() {
    const rows: {
        Name: string,
        Status: string,
        ConfigFiles: string,
    }[] = JSON.parse(execSync('docker compose ls --format json').toString('utf8'))
    const vars: [string, string][] = [];
    for (const row of rows) {
        for (const key in row) {
            const cv = stripColors(String(row[key]));
            const str = cv;
            vars.push([str, row[key]]);
            row[key] = str;
        }
    }

    let str = table(rows) as string;
    for (const [key, value] of vars) {
        str = str.replace(key, value)
    }

    return str;
}