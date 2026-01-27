---
title: Node-RED on Kubernetes
date: '2020-08-10'
tags:
  - Kubernetes
excerpt: Setup instructions for Node-RED on Kubernetes
---
# Node-RED on Kubernetes

[Node-RED](https://www.nodered.org/) is a browser based tool that can create visual flows and API's. It's written in NodeJS, Open-source and backed by IBM. You can write your own custom functions in Javascript or community and deploy them as part of your flow. 

This blog post will cover how to setup Node-RED on Kubernetes. 

### Prerequisites 

This guide assumes you already have K8s with persistent storage or k3s setup. 

### Deployment YAML

Download the following YAML and unzip: <https://gist.github.com/adamhancock/a8447dcf479679bfb467ca9d5fbb64ad>

Update ingress.yml and replace yourdomain.tld with your domain. Change into the extracted directory and run

```
kubectl apply -f .
```

Point your [y](https://blog.adamhancock.co.uk/nodered-on-kubernetes/yourdomain.tld)ourdomain.tld DNS at your ingress controller and your Node-RED should will be available. 
