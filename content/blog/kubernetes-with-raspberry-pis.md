---
title: Running Kubernetes with Raspberry Pi's
date: '2020-05-03'
tags:
  - Kubernetes
excerpt: An overview into the Kubernetes cluster I created at home.
---
# Running Kubernetes with Raspberry Pi's

I recently built a Kubernetes cluster on four Raspberry Pi's. My requirement was to be able to run containers with persistent storage for my home network. I generally recommend that you choose to use a [Kubernetes cloud provider](https://m.do.co/c/1fc1cc76cb30) but building a cluster from scratch at home is a really great learning experience. Unless the image author supports it, there are [some extra steps](https://community.arm.com/developer/tools-software/tools/b/tools-software-ides-blog/posts/getting-started-with-docker-for-arm-on-linux) with running containers on ARM processors however it's becoming more widely supported. I based my setup of this [guide.](https://itnext.io/building-an-arm-kubernetes-cluster-ef31032636f9) 

<img src="https://cdn.adamhancock.co.uk/blog/2020/8/61142_image-1.png" width="80%">

I used four of the Raspberry Pi 4's with 4GB of Memory. The master Pi has a 1TB SSD plugged in via USB 3.0 enclosure. [I'm using a stackable case I found on amazon to house them. ](https://www.amazon.co.uk/gp/product/B07BGWNWWR) As this cluster runs at home I needed it to run quietly. You can run the Pi's without Fans but the CPU will start to heavily throttle as temperatures rise. I'm using the [SHIM fan from Pimoroni](https://www.amazon.co.uk/gp/product/B07TTTCN8H) to keep everything running cool, the software provided with the Fan allows you to set thresholds for when the fans are operated. 

**Overview of the Nodes:**

```
~ kubectl get nodes 
NAME                 STATUS   ROLES    AGE    VERSION
master1.rpi.a9k.io   Ready    master   114d   v1.17.2
worker1.rpi.a9k.io   Ready    <none>   114d   v1.17.2
worker2.rpi.a9k.io   Ready    <none>   114d   v1.17.2
worker3.rpi.a9k.io   Ready    <none>   105d   v1.17.2

```

<img src="https://cdn.adamhancock.co.uk/blog/2020/8/61143_Raspberry-PI.png" width="80%">


### Base Setup

I'm running Raspbian Buster on all four Pi's. Kubernetes was installed via kubeadm and I'm using the Flannel CNI. 

### Services  

**NGINX Ingress -** Ingress in Kubernetes is essentially a webserver running as a reverse proxy. It will allow routing on http host header to the appropriate container and automatically updates it's configuration as your cluster changes. I chose to use NGINX ingress for this cluster but [Traefik](https://containo.us/traefik/) is an alternative that I also recommend. 

**MetalLB** \- Out of the box K8s doesn't offer a network implementation of a load balancer, you're required to either bring your own or it's a provided to you by your cloud provider. MetalLB looks to solve this. It isn't recommended for production clusters as it's still in Beta but I've had no issues and been very impressed with it so far. I'm using MetalLB in Layer 2 mode, there's around 10 seconds of downtime for the ARP cache to timeout if the lead node fails. When installing you specify the IP range that MetalLB can use to provision load balancers.

**Cert-Manager -** I'm using [cert-manager](https://github.com/jetstack/cert-manager) by Jetstack to automatically generate and renew Letsencrypt TLS certficates for NGINX. Cert-manager is setup to perform DNS validation with Cloudflare. 

**Samba** \- I'm running this [Samba container](https://github.com/dperson/samba). I had an issue with using Samba over the top of NFS with MacOS extended attributes. I had to disable extended attribute support in Samba to get writing to the share from MacOS working. [Feel free to use my container. ](https://hub.docker.com/repository/docker/adamhancock/samba-arm/general)

**Logging -** I'm using the free tier of [logz.io](https://www.logz.io) to ship my cluster logs off to a hosted Elasticsearch & Kibana instance. One of the issues I faced with logz.io is that they don't have any arm compatible images. I was able to build new images using Docker buildx and they're available on dockerhub [here](https://hub.docker.com/repository/docker/adamhancock/logzio-k8s-arm)

### Persistent Storage

Persistent storage is another feature that is provided to you out of the box with a cloud managed Kubernetes cluster and Running your own on premise storage in Kubernetes has a [reputation of being difficult](https://softwareengineeringdaily.com/2019/01/11/why-is-storage-on-kubernetes-is-so-hard). I decided to use NFS based storage to store persistent volumes. 

The master Pi in my cluster has a 1TB SSD drive attached to it. I'm running a NFS server on the master PI and [an NFS provisioner](https://quay.io/repository/external%5Fstorage/nfs-client-provisioner-arm?tag=latest&tab=tags) to create persistent volumes. The Provisioner serves any persistent volume claims and creates a directory on the USB SSD drives automatically. The NFS provisioner supports ReadWriteOnce and ReadWriteMany, I have a common ReadWriteMany data share that I share between most of the containers in my cluster.

## Building your own cluster? 

If you're new to Docker & Kubernetes I'd highly recommend you take the following courses by Brett Fisher:

* Docker Mastery: [https://www.udemy.com/course/docker-mastery](https://www.udemy.com/course/docker-mastery/)
* Kubernetes Mastery: [https://www.udemy.com/course/kubernetesmastery](https://www.udemy.com/course/kubernetesmastery/l)

The docker mastery one is especially useful to learn how to build your own images and containerize applications. 

I'd also recommend taking a look at K3s if you only want to run one Pi or you've never used Kubernetes before, it's comparable to using a managed cloud cluster. K3s is a lightweight distribution of Kubernetes that doesn't require a multi node setup. K3s is more opinionated, it comes with container networking and Traefik Ingress out of the box. 
