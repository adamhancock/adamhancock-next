---
title: Deploying UniFi Controller on Kubernetes
date: '2020-02-02'
tags:
  - Kubernetes
  - UniFi
excerpt: Deploying UniFi controller on Kubernetes with an SSL certificate.
---
# Deploying UniFi Controller on Kubernetes

The following guide is a walkthrough on deploying the Ubiquiti UniFi controller software on Kubernetes. 

This guide can be followed on a Managed Kubernetes (Azure, GKE or Digital Ocean) instance or bare metal.

The guide will work on both x86-64 and ARM processors (Raspberry PI's) 

Baremetal will require persistent storage to be setup and it's recommended to use metalLB for loadbalancer creation. You should provision your ingress controller with a loadBalancer and take note of the IP. 

You should have cert-manager already setup if you want to use TLS encryption on the admin GUI. 

To get started, clone the repository

```SHELL
git clone https://github.com/adamhancock/UniFi-on-k8s.git
cd UniFi-on-k8s/yaml
```

* Edit the unifi-controller-ingress.yaml and replace unifi.yourdomain.tld with your hostname. Update the cluster issuer to be the same as your cert-manager cluster issuer.
* Edit unifi-controller-service.yaml and replace externalIPs (at the bottom) with the IP address of your load balancer. It's recommended to use the same IP as your ingress controller.

Create the unifi namespace

```SHELL
kubectl create namespace unifi
```

Apply the yaml

```SHELL
kubectl apply -f . --namespace=unifi

```

Kubernetes will create the resources required. If you haven't already, create your DNS for unifi.yourdomain.tld to point at your LB IP address. 

Your UniFi installation will now be available at https://unifi.yourdomain.tld

### Traefik

If you're running traefik as your ingress controller, you will need to allow traefik to use insecure backend certificates. Edit your traefik deployment and add the following argument:

```YAML
# Traefik v1
- --insecureSkipVerify=true

# Traefik v2
- --serverstransport.insecureskipverify=true

```

Github: <https://github.com/adamhancock/UniFi-on-k8s>  
Docker Image: <https://hub.docker.com/r/linuxserver/unifi-controller>
