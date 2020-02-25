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

## Prep + Run Application
1. run `npm install` on each folder

1. in `backend`
1. `npm run build`
1. `pm2 start npm --name "backend" -- start`

1. in `frontend`
1. `npm install`
1. `npm run build`
1. `pm2 start npm --name "frontend" -- start`

## Configure nginx

At this point we can't access port 7777 because nginx only opens up port 80 (http) and port 443 (https).

1. go to `/etc/nginx/sites-available`
1. Make a new file with `touch backend`
1. edit it:

```nginx

        location /backend {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location / {
            proxy_pass http://localhost:7777;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
```

Remove the default:
`rm default`
`rm sites-enabled/default`

Then restart nginx:
`sudo nginx -s reload`

## Upload your files to your droplet


## Assign a domain name to your droplet

## Get an SSL Cert
