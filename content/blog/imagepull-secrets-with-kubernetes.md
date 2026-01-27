---
title: "ImagePull Secrets with Kubernetes \U0001F511"
date: '2020-08-10'
tags:
  - Kubernetes
excerpt: How to use ImagePull Secrets in Kubernetes
---
# ImagePull Secrets with Kubernetes 🔑

If your container uses an image thats held in a private repository then you will need to authenticate before accessing it. 

This post will cover the different ways possible to authenticate with a docker registry. 

### Creating the Registry secret

The first step is to create the secret. In this example I will use azure container registry. 

```
kubectl create secret docker-registry azure \
  --docker-server myregistry.azurecr.io \      
  --docker-username <registryusername> \
  --docker-password <registrypassword>
```

### Using Deployment YAML

You can update your deployment YAML to utilise the above secret. 

```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: test
  name: test
  namespace: test
spec:
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      containers:
          image: myregistry.azurecr.io/test-app
          imagePullPolicy: Always
          name: test
      imagePullSecrets:
        - name: azure

```

### Using a Service Account

Each namespace in Kubernetes is created with a default service account. This service account can be use a docker-registry secret. The benefit of adding a service account this way is that you will not need to update the existing YAML. Any containers in this namespace will use the ImagePull secret by default. 

```
kubectl edit serviceaccount default -n test
```

Update the YAML to add the imagePullSecret like below. 

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default
  namespace: test
secrets:
- name: default-token-2v4n2
imagePullSecrets:
- name: azure 
```
