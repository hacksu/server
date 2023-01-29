import chalk from 'chalk';
import { execSync } from 'child_process'
import { Console } from 'console'
import { readFileSync } from 'fs'
import { Transform } from 'stream'


const BLUE = '#4683ff';
const GREEN = '#35c982';

const blue = chalk.hex(BLUE);
const green = chalk.hex(GREEN);
const yellow = chalk.yellow;
const gray = chalk.gray;
const red = chalk.red;


function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    // @ts-ignore
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(0);
    let minutes = (ms / (1000 * 60)).toFixed(0);
    let hours = (ms / (1000 * 60 * 60)).toFixed(0);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
    if (Number(seconds) < 60) return seconds + "s";
    else if (Number(minutes) < 60) return minutes + " m";
    else if (Number(hours) < 24) return hours + "h";
    else return days + "d"
}


function table(input) {
    // @see https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
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

function cvalue(input) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts, colorMode: 'auto' })
    logger.log(input)
    const result = (ts.read() || '').toString()
    // let result = '';
    return result;
}

const ASCII_COLORS = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
const stripColors = (input: string) => input.replace(ASCII_COLORS, '');

export async function pm2Status() {
    const data = JSON.parse(execSync('pm2 status').toString('utf8'));
    // const data = JSON.parse(readFileSync(__dirname + '/../test/pm2.json').toString('utf8'));
    const rows: {
        // id: number,
        name: string,
        status: string,
        uptime: string,
        ['↻']: number,
        cpu: string,
        mem: string,
    }[] = [];
    for (const proc of data) {
        const id = proc.pm_id;
        const name = proc.name;

        let status = proc.pm2_env.status
        if (status === 'online') {
            status = green(status);
        } else {
            status = red(status);
        }

        const uptime = msToTime(Date.now() - proc.pm2_env.pm_uptime);
        const restarts = proc.pm2_env.restart_time;

        let cpu = proc.monit.cpu;
        if (cpu > 70) {
            cpu = red(cpu + ' %');
        } else if (cpu > 30) {
            cpu = yellow(cpu + ' %')
        } else if (cpu > 5) {
            cpu = blue(cpu + ' %')
        } else {
            cpu = (cpu + ' %');
        }

        const mem = humanFileSize(proc.monit.memory);

        rows.push({
            // id,
            name,
            status,
            uptime,
            ['↻']: restarts,
            cpu,
            mem,
        })
    }


    const vars: [string, string][] = [];
    for (const row of rows) {
        for (const key in row) {
            // const n = vars.push(row[key]) - 1;
            // console.log()
            // const str = cvalue(row[key]).length - 1
            const cv = stripColors(String(row[key]));
            // let str = ''; //`$${vars.length}`;
            // // str += 'O'.repeat(cvalue(row[key]).length - str.length);
            // str = cv.slice(0, -str.length);
            // console.log(str.length, cvalue(row[key]).length)
            const str = cv;
            vars.push([str, row[key]]);
            row[key] = str;
        }
    }

    let str = table(rows) as string;
    let n = 0;
    for (const [key, value] of vars) {
        str = str.replace(key, value)
    }

    // console.log(str);
    return str;
}

pm2Status().catch(err => {})