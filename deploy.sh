#!/bin/bash
scp ./install.sh root@$1:/root
scp ./pubkey root@$1:/root
ssh -t root@$1 'apt-get update && apt-get install -y docker.io'
