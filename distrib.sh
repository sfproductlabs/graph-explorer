#!/bin/bash
sudo PORT=8888 docker build -t sfproductlabs/graph-explorer:latest .
cat ~/.DH_TOKEN | sudo docker login --username sfproductlabs --password-stdin
sudo docker push sfproductlabs/graph-explorer:latest