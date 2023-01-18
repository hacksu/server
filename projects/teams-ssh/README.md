

## Teams-SSH

Automatically adds users, as well as adds and revokes ssh and sudo access.

- To gain SSH access to HacKSU servers; you must be a member of [Team - SSH](https://github.com/orgs/hacksu/teams/ssh)
- To gain Sudo access to HacKSU servers; you must be a member of [Team - Sudo](https://github.com/orgs/hacksu/teams/sudo)

### Installation

1. Ensure `hacksu-read.pem` is present. This is a private key tied to [Hacksu - Read](https://github.com/organizations/hacksu/settings/apps/hacksu-read). You can generate new private keys by clicking `Generate a private key`

2. Run `bash setup.sh`. This will install [pm2](https://pm2.keymetrics.io/), node, and any necessary dependencies. Then, it will set up this program to run as root at all times.

3. Run `ls /home` and you should hopefully see some user accounts!

4. Test your own by logging into it via `ssh [YOUR_GITHUB_USERNAME:LOWERCASE]@ip`, such as user `JohnDoe` will be `ssh johndoe@123.123.123.123`

### Unable to login

Can't login? If this program ever breaks, just fallback to using the server like normal.

All cloud providers give you a way to add a ssh key to the server. Login to our provider, follow the cloud provider's instructions, and add your ssh key and just login using the default user for the server.

Example: Oracle's default user is `ubuntu`. Add your ssh key on the oracle cloud panel for the server and just login with `ssh ubuntu@123.123.123.123`

