#!/bin/bash

# needed on first run within wsl2 if using docker desktop in windows
# from https://stackoverflow.com/questions/72528606/docker-rancher-permission-denied-when-using-docker-from-wsl

sudo addgroup --system docker
sudo adduser $USER docker
newgrp docker
sudo chown root:docker /var/run/docker.sock
sudo chmod g+w /var/run/docker.sock