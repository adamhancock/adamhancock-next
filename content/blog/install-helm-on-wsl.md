---
title: Install Helm on WSL
date: '2020-01-21'
updated: '2026-01-29'
tags:
  - Kubernetes
excerpt: >-
  How to install Helm package manager for Kubernetes on WSL (Windows Subsystem
  for Linux)
---
# Install Helm on WSL

Helm to Kubernetes is like APT is to Ubuntu. Helm Charts are community maintained ready to go applications. Charts assist you with installing & keeping up to date complex applications.

## Option 1: Install Script (Recommended)

The easiest way to install Helm on WSL:

```bash
# Download and run the install script
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh
./get_helm.sh

# Confirm it works
helm version
```

Or if you prefer a one-liner:

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash
```

## Option 2: APT Package (Debian/Ubuntu WSL)

If you're running Ubuntu or Debian in WSL, you can install via apt:

```bash
# Add the Helm repository
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list

# Install
sudo apt-get update
sudo apt-get install helm
```

## Option 3: Snap

```bash
sudo snap install helm --classic
```

---

See my other recommended CLI tooling for Kubernetes:

[My recommended Kubernetes command line toolset!](/blog/kubernetes-cli-tools)
