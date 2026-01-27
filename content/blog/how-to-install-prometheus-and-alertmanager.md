---
title: How to Install Prometheus on Kubernetes
date: '2020-01-14'
tags:
  - Kubernetes
excerpt: >-
  How to install Prometheus & Alert Manager with NGINX ingress and
  authentication.
---
# How to Install Prometheus on Kubernetes

# 

Install helm package manager if you do not have it.

```
## Ubuntu
sudo snap install helm-snap
## MacOS
brew install helm
## Chocolatey
choco install helm

```

You will need the stable repository for helm:

```
helm repo add stable https://kubernetes-charts.storage.googleapis.com/

```

Create the prometheus namespace:

```
kubectl create namespace prometheus

```

Install prometheus:

```
helm install prometheus stable/prometheus --namespace=prometheus

```

---

# Creating an Ingress Resource for Prometheus Server

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-prometheus
  annotations:
    # use the shared ingress-nginx
    kubernetes.io/ingress.class: 'nginx'
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  rules:
  ## Prometheus Server
    - host: prometheus.yourdomain.tld
      http:
        paths:
          - path: /
            backend:
              serviceName: prometheus-server
              servicePort: 80
    ## Prometheus alert manager
    - host: alerts.prometheus.yourdomain.tld
      http:
        paths:
          - path: /
            backend:
              serviceName: prometheus-alertmanager
              servicePort: 80
  
  ## Only add below if you have cert-manager.io and need SSL. You will need DNS validation setup to issue a wildcard certificate. 
  tls: 
    - hosts:
        - *.prometheus.yourdomain.tld
      secretName: prometheus-server-cert

```

* Replace yourdomain.tld with your domain.
* Save as prometheus-server-ingress.yaml and apply:

```
kubectl apply -f prometheus-server-ingress.yaml --namespace=prometheus

```

# Adding authentication to Prometheus Ingress

Run the following command to generate a basic auth file.

```
htpasswd -c auth admin

```

Create a secret from that file:

```
kubectl create secret generic basic-auth --from-file=auth --namespace=prometheus

```

Update prometheus-server-ingress.yaml annotations to add auth:

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-prometheus
  annotations:
    # use the shared ingress-nginx
    kubernetes.io/ingress.class: 'nginx'
    cert-manager.io/cluster-issuer: letsencrypt-prod
    # type of authentication
    nginx.ingress.kubernetes.io/auth-type: basic
    # name of the secret that contains the user/password definitions
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    # message to display
    nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required'
spec:
  rules:
  ## Prometheus Server
    - host: prometheus.yourdomain.tld
      http:
        paths:
          - path: /
            backend:
              serviceName: prometheus-server
              servicePort: 80
    ## Prometheus alert manager
    - host: alerts.prometheus.yourdomain.tld
      http:
        paths:
          - path: /
            backend:
              serviceName: prometheus-alertmanager
              servicePort: 80
  
  ## Only add below if you have cert-manager.io and need SSL. 
  ### You will need DNS validation setup to issue a wildcard certificate. 
  tls: 
    - hosts:
        - *.prometheus.yourdomain.tld
      secretName: prometheus-server-cert

```

Apply the updated ingress YAML.

```
kubectl apply -f prometheus-server-ingress.yaml --namespace=prometheus

```

Prometheus server is available here: prometheus.yourdomain.tld  
Alert Manager is available here: alerts.prometheus.yourdomain.tld
