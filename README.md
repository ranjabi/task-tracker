# Task Tracker

## Development
There are 2 ways to run the development on your local machine.

1 . Run docker for postgres database
In this first approach, nextjs development will run on your local machine and the database will run on container. 
1. Pull this repository and make sure you already have docker installed
2. Create `.env.development` and fill it with
    ```
    DATABASE_URL=postgresql://postgres:secret@localhost:5433/task-tracker-dev?schema=public
    ```
3. Run `yarn run-with-db`

The command already included prisma generate, migrate, and seed so the database is ready to use.

2 . Run docker for nextjs and postgres database  
*Currently, the hotreload feature is not working and still on progress to fix. 
1. Pull this repository and make sure you already have docker installed
2. Run `yarn run docker-compose:dev`

## Deployment
For the deployment, we utilize CI/CD for automated pipeline using github action. These are step by step that will run for the deployment:
1. Push a commit into main branch
2. Github action will be triggered automatically. These step below is done in github action. 
3. Run `docker build` with Dockerfile in root directory
4. Push an image into digital ocean registry using `digitalocean/action-doctl`
5. Pull the image into digital ocean vm (droplets)
6. Run a container from the image by using `docker run`

To Do:
- [ ] Use docker compose in github action for deployment
- [ ] Handle prisma generate and migrate in production

Notes:
- `yarn run-with-db` will use these commands below:
  ```
  => yarn run docker-compose-db:dev && yarn prisma generate && yarn run migrate:dev && yarn dev
  
  "docker-compose-db:dev": "docker compose -f docker-compose-db.dev.yaml up --detach"
  "migrate:dev": "dotenv -e .env.development -- yarn prisma migrate dev"
  ```