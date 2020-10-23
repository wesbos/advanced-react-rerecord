brew install doctl

doctl apps create --spec .do/app.yaml

You'll need to put a DATABASE_URL env variable in via the app.yaml or their UI after deploy.

to update:
`doctl apps list` to grab the ID

doctl apps update IDGOESHERE --spec .do/app.yaml

