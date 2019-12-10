#!/bin/bash

# Update

sudo apt update -y

sudo apt full-upgrade

# Install Node

curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

sudo apt install nodejs

# Install pm2

sudo npm install -g pm2

# Install Streaming App

git clone # TODO: STREAMING APP NAME 
# cd into it and npm install

# Set Hostname

# Line 127.0.0.1 replace with "stream1"
sudo vim /etc/hosts

# Setup ssh (https://www.raspberrypi.org/documentation/configuration/security.md)

# Using key-based authentication.

# Key pairs are two cryptographically secure keys. One is private, and one is public. They can be used to authenticate a client to an SSH server (in this case the Raspberry Pi).

# The client generates two keys, which are cryptographically linked to each other. The private key should never be released, but the public key can be freely shared. The SSH server takes a copy of the public key, and, when a link is requested, uses this key to send the client a challenge message, which the client will encrypt using the private key. If the server can use the public key to decrypt this message back to the original challenge message, then the identity of the client can be confirmed.

# Generating a key pair in Linux is done using the ssh-keygen command on the client; the keys are stored by default in the .ssh folder in the user's home directory. The private key will be called id_rsa and the associated public key will be called id_rsa.pub. The key will be 2048 bits long: breaking the encryption on a key of that length would take an extremely long time, so it is very secure. You can make longer keys if the situation demands it. Note that you should only do the generation process once: if repeated, it will overwrite any previous generated keys. Anything relying on those old keys will need to be updated to the new keys.

# You will be prompted for a passphrase during key generation: this is an extra level of security. For the moment, leave this blank.

# The public key now needs to be moved on to the server: see Copy your public key to your Raspberry Pi.

# Finally, we need to disable password logins, so that all authentication is done by the key pairs.

# sudo nano /etc/ssh/sshd_config

# There are three lines that need to be changed to no, if they are not set that way already:

# ChallengeResponseAuthentication no
# PasswordAuthentication no
# UsePAM no

# Save the file and either restart the ssh system with sudo service ssh reload or reboot.