1. Sign up for digital ocean and create a droplet
2. Select Node.js Quickstart Image, $5 a month (I think this is enough to npm install)
3. Select any location
4. SSH into it

## Update Node Version
1. `npm install n -g`
1. `n latest`

## Get to know pm2

1. See what is running with `pm2 ls`
2. Stop the current process with `pm2 stop 0`
3. Start it again with `pm2 start 0`
3. stop again with `pm2 stop 0`
4. Remove it entirely with `pm2 delete 0`
5. Start it again with `pm2 start hello.js --name "Hello Example"
6. Access logs with `pm2 logs 0`

## git clone or SFTP up your files:

cd /var/wwww
git clone https://github.com/wesbos/advanced-react-rerecord.git

cd backend

## Setup Env variables
1. cd `backend`
2. `mv sample.env .env`
3. run `ls -la` to ensure it's there
4. Edit it `vim .env`
5. Press `i` to enter insert mode
6. Enter in details, or paste in
7. `esc`, then type `:wq`

## Prep Application
1. run `npm install` on each side

## Kill the existing Process
`pm2

## Cheat Sheet:

pm2 ls - lists scripts runing

## Upload your files to your droplet


## Assign a domain name to your droplet

## Get an SSL Cert
