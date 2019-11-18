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

c_build:
	@ docker build -t nkernis/gossip:${TAG} .

c_push:
	@ docker push nkernis/gossip:${TAG}

c_run:
	# TODO: FINISH...
	@ docker run nkernis/gossip:${TAG}


.PHONY : base