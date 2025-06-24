import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/lib/adapters/JSONFile';
import { __data, env, installation } from './config';


type Member = Awaited<ReturnType<typeof getMembers>>['data'][number]

type Database = { teams: Teams }; 
type Teams = Record<string, { members: Member[] }>;
const db = new Low<Database>(new JSONFile(__data + '/teams.json'));

async function initDB() {
    if (db.data) return db;

    await db.read();
    db.data ||= {
        teams: {}
    };

    return db;
}


export async function getMembers(team: string) {
    return (await installation).request('GET /orgs/{org}/teams/{team_slug}/members', {
        org: env.GITHUB_ORG,
        team_slug: team,
    })
}

export async function getMembersDelta(team: string) {
    await initDB();

    const members = (await getMembers(team)).data;
    const current = db.data?.teams?.[team] || { members: [] };
    const added = new Array<Member>();
    const removed = new Array<Member>();
    for (const member of members) {
        if (!current.members.find(o => o.login === member.login)) {
            added.push(member);
            console.log({ team }, '+ member', { login: member.login });
        }
    }
    for (const member of current.members) {
        if (!members.find(o => o.login === member.login)) {
            removed.push(member);
            console.log({ team }, '- member', { login: member.login });
        }
    }

    const commit = async () => {
        db.data!.teams[team] = {
            ...db.data?.teams[team],
            members,
        }
        await db.write();
    }

    return {
        members,
        added,
        removed,
        commit,
    }
}

