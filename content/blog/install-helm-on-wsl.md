---
title: Install Helm on WSL
date: '2020-01-21'
tags:
  - Kubernetes
excerpt: >-
  How to install Helm package manager for Kubernetes on WSL (Windows Subsystem
  for Linux)
---
# Install Helm on WSL

Helm to Kubernetes is like APT is to Ubuntu. Helm Charts are community maintained ready to go applications. Charts assist you with installing & keeping up to date complex applications.

```
# Download the install shell script
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3

# Allow to Run
chmod 700 get_helm.sh
# Install
./get_helm.sh

# Confirm it works
$helm version
    version.BuildInfo{Version:"v3.0.2", GitCommit:"19e47ee3283ae98139d98460de796c1be1e3975f", GitTreeState:"clean", 		GoVersion:"go1.13.5"}
```

See my other recommended CLI tooling for Kubernetes:

[My recommended Kubernetes command line toolset!](/blog/kubernetes-cli-tools)
