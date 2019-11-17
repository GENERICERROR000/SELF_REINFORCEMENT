build:
	@ docker build -t gossip:${TAG} .

base:
	@ echo 'carl'
    # 1) Create network needed
    # 2) Create swarm
    # 3) Start container and join swarm

member:
	@ echo 'carl'

monitor:
	@ echo 'carl'

display:
	@ echo 'carl'

.PHONY : base