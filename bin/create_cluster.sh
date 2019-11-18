#!/usr/bin/env bash

set -euo pipefail

# Machine 1 (manager)
docker swarm init --advertise-addr <MANAGER-IP>

docker swarm join-token worker # ???

# Machine 2 (worker)
docker swarm join --token <TOKEN> <MANAGER-IP>:2377

# Machine 1
docker node ls
docker network create --driver overlay gossip-net
docker network ls

# Service 1
docker service create \
	--replicas 1 \
	--network gossip-net \
	-p 3001:3001 \
	--name base \
	-e HOST=base \
	-e PORT=3001 \
	-e NAME=base \
	-e BASES=base:3001 \
	-e MODE=base \
	nkernis/gossip:${TAG}

# Service 2
docker service create \
	--replicas 1 \
	--network gossip-net \
	-p 3002:3002 \
	--name member \
	-e HOST=member \
	-e PORT=3001 \
	-e NAME=member  \
	-e BASES=base:3001 \
	-e MODE=member \
	nkernis/gossip:${TAG}
