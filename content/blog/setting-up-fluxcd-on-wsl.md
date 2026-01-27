---
title: Fluxctl on WSL
date: '2020-01-21'
tags:
  - Kubernetes
excerpt: How to setup fluxctl on Windows Subsystem for Linux.
---
# Fluxctl on WSL

How to instal fluxcd fluxctl on Windows Subsystem for Linux

```
sudo wget https://github.com/fluxcd/flux/releases/download/1.17.1/fluxctl_windows_amd64 -O /usr/bin/fluxctl && sudo chmod +x /usr/bin/fluxctl
```

Run the following command in your WSL

```
## Verify installed
$ fluxctl version
1.17.1
```
