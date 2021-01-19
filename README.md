# bitcoincash-marketplace

![screenshot](https://imgur.com/download/B5ZO5AB)

## How to run

```
cd backend
yarn
docker-compose up -d
npx sequelize db:migrate
node bin/www
cd ..
cd frontend
yarn
yarn dev
```

and open `http://localhost:3000`

## To do

- [ ] upload to google cloud platform
- [ ] add chat system
- [ ] add rating system
