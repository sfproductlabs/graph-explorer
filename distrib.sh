#!/bin/bash
sudo docker build -t graph-explorer .
cat ~/.DH_TOKEN | sudo docker login --username sfproductlabs --password-stdin
sudo docker tag $(sudo docker images -q | head -1) sfproductlabs/graph-explorer:latest
sudo docker push sfproductlabs/graph-explorer:latest