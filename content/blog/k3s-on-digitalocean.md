---
title: K3s on a Digital Ocean
date: '2020-05-03'
tags:
  - Kubernetes
excerpt: Running a small K3s cluster on Digital Ocean
---
# K3s on a Digital Ocean

K3s is a lightweight distribution of Kubernetes created Rancher Labs. It can be run on a single host (or multiple). K3s is more opinionated than upstream Kubernetes, that isn't necessarily a bad thing.

The standard K3s batteries included stack is: 

* Ingress - Traefik
* Container Networking - Flannel
* Persistent Storage - Local Path Provisioner - This creates persistent volumes under a local path on your system.

I setup K3s on [Digital Ocean](https://m.do.co/c/1fc1cc76cb30) to run this Blog, Ubiquti's UniFi Controller and a few other personal projects in containers. My goal was to be able to create a container platform while keeping costs to a minimum. Digital Ocean do offer a Managed Kubernetes solution but you have to pay for Persistent Volumes and Load Balancer. I'm running a single droplet with 2 vCPU's, 4GB of memory and 80GB storage. 

### Install K3s

Unlike upstream K8s, K3s is very simple to setup. Head over to [www.k3s.io](https://www.k3s.io) and run the install instructions as root on your digital ocean droplet:

```
  curl -sfL https://get.k3s.io | sh -
  # Check for Ready node, 
  takes maybe 30 seconds
  k3s kubectl get node
```

Once K3s has finished installing you'll want to switch to using kubectl instead of the k3s client. I manage other clusters from kubectl and switch between them using [kubectx](https://github.com/ahmetb/kubectx).

You can install the latest version kubectl by following the install instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

On your digital ocean droplet, grab the kubeconfig that rancher has generated.

```
cat /etc/rancher/k3s/k3s.yaml
```

Copy the contents to your local machine. For this example, we'll assume that you copied it to /tmp/kubeconfig on your local machine. 

```console
cp ~/.kube/config ~/.kube/config.bak
```

Backup your current config

```console
KUBECONFIG=~/.kube/config:/tmp/kubeconfig kubectl config view --flatten > /.kube/config
```

Merge your new k3s cluster config into your current one. 

You can now remove the backup one. 

```
rm  ~/.kube/config.bak
```

If your merge was successful, you should now be able to run the get nodes command on your system. 

```
kubectl get nodes
```

I'd recommend to lock down all ports apart from 80 & 443 on your Droplet to your home IP address; you can do this via the digital ocean control panel. 
