https://dev.to/vorillaz/how-to-dockerize-a-nextjs-app-4e4h

# Build image

### login Gitlab

```
docker login registry.gitlab.com
```

### build image

```
docker build -t registry.gitlab.com/quizapp-project/bankquiz-next .
```

### or `tag` image

```
docker tag bankquiznext:latest registry.gitlab.com/quizapp-project/bankquiz-next:latest
```

### push

```
docker push registry.gitlab.com/quizapp-project/bankquiz-next
```

### pull

```
docker pull registry.gitlab.com/quizapp-project/bankquiz-next
```

# Run container

## Run container `quiz.ai-Next`

```
docker run -p 3000:3000 \
-v ./logs:/logs \
bankquiznext:latest
```

env

```
docker run -p 3000:3000 \
-e DATABASE_URL="postgresql://new_user:new_password@new_host:new_port/new_database"
bankquiznext:latest
```

## docker-compose

```yml
version: "3.8"

services:
  bankquiz-next:
    image: bankquiznext:latest
    ports:
      - "3000:3000"
    volumes:
      - ./logs:/logs
    # environment:
    # - DATABASE_URL=postgresql://new_user:new_password@new_host:new_port/new_database
```

## Run `docker-compose`

#### 1. Create folder for `logs` before run `docker-compose up`

```
mkdir -p ./logs;
chown -R 1001:1001 ./logs;
chmod 755 ./logs;
```

docker-compose up

```yml
services:
  bankquiz-next:
    container_name: bankquiz-next-01
    image: registry.gitlab.com/quizapp-project/bankquiz-next:latest
    restart: always
    environment:
      - APP_NODE_ID=bq-ubtsv05 ### EDIT NODE_ID
    ports:
      - "3000:3000"
    volumes:
      - ./logs:/logs
```
