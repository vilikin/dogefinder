# Dogefinder

## Setup with docker

1. `cp .env.sample .env` (fill in env variables)
2. `docker build dogefinder .`
3. `docker run -d dogefinder`

## Setup without docker (dev)

1. `cp .env.sample .env` (fill in env variables)
2. `npm install`
3. `npm run build` (compiles typescript)
4. `npm start`
