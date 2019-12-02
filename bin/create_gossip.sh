#!/usr/bin/env bash

set -euo pipefail

# WARN: NOT MEANT TO BE RUN - GENERAL INSTRUCTIONS

# TODO: TEST THIS: 
# MAC - TO - MAC IS NOT EASY FOR SWARM
# 1) vagrant TO CREATE VMS 
# 2) docker-machiine https://medium.com/@thomas.mylab33/running-docker-swarm-on-two-macbooks-2029f310b2df 
	# - https://github.com/senecajs/ramanujan/blob/master/docker/docker.txt
# 3) MAYBE RPI IS A GOOD IDEA?

# Machine 1 (manager)

docker swarm init --advertise-addr <MANAGER-IP>:2377

# Get token if above didn't output
# docker swarm join-token worker

# Machine 2 (worker)
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
docker node update --label-add <key>=<value> <node-id>

# NOTE: could use this to host in cluster and push from my laptop
# docker service create --name registry --publish published=5000,target=5000 registry:2

# Machine 1
docker node ls
docker network create -d overlay gossip-net
docker network ls

# To deploy your application across the swarm, use `docker stack deploy`.

# Base
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
	nkernis/gossip:0.0.0

docker service logs -f base

# Monitor
docker service create \
	--replicas 1 \
	--network gossip-net \
	-p 3000:3000 \
	--name monitor \
	-e HOST=monitor \
	-e PORT=3000 \
	-e NAME=monitor  \
	-e BASES=base:3001 \
	-e MODE=monitor \
	nkernis/gossip:0.0.0

docker service logs -f monitor

# Member
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
	nkernis/gossip:0.0.0

docker service logs -f member