#!/bin/bash

# WARN: Not to be run - just steps

# Update

sudo apt -y update && sudo apt -y full-upgrade

# Install Node (and cli tools)

	# None Zero
	curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
	sudo apt install -y nodejs vim tmux git

	# Zero
	curl -o node-v11.15.0-linux-armv6l.tar.xz.gz https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.gz
	tar -xzf node-v11.15.0-linux-armv6l.tar.xz.gz
	sudo cp -r node-v11.15.0-linux-armv6l/* /usr/local/
	rm -rf node-v11.15.0-linux-armv6l && rm node-v11.15.0-linux-armv6l.tar.xz.gz
	sudo apt install -y vim tmux git

# Install pm2

sudo npm install -g pm2

# Install Streaming App

git clone https://github.com/131/h264-live-player.git && cd h264-live-player && sudo npm install

# Setup ssh (From Host)
ssh-copy-id -i ~/.ssh/rpi_rsa pi@raspberrypi.local

# Disable Password

sudo vim /etc/ssh/sshd_config
# Change to 'no'
	# ChallengeResponseAuthentication no
	# PasswordAuthentication no
	# UsePAM no
sudo service ssh reload

# Enable Camera Module and Set Hostname "stream1"

sudo raspi-config

raspistill -v -o test.jpg