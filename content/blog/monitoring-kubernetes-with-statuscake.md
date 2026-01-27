---
title: Monitoring Kubernetes with Statuscake
date: '2020-02-02'
tags:
  - Kubernetes
excerpt: How to create a cronjob in kubernetes for free uptime monitoring
---
# Monitoring Kubernetes with Statuscake

Statuscake push monitors are a basic (and free) check that can be setup to make sure your kube-scheduler is functioning correctly. 

This guide will show you how to create a Kubernetes job that launches a curl command to your Statuscake push monitor. 

### Prerequisites :

* Free Statuscake account with a contact group setup.
* Kubernetes Cluster with kubectl setup on your local machine.

### Statuscake setup

Login to Statuscake and click N**ew Uptime Test** from the navigation menu. 

Select a test type of **PUSH,** add your test name and contact group. Save your new monitor. Save the Push URL for later. 

### Kubernetes Setup

Create a secret with your Statuscake push URL by running the following command:

```BASH
kubectl create secret generic statuscake \
--from-literal=url="<Your push URL>"
```

Create statuscake-cronjob.yml or

```BASH
kubectl apply -f https://raw.githubusercontent.com/adamhancock/statuscake-push-k8s/master/statuscake-cronjob.yaml
```

```YAML
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: statuscakepush
spec:
  schedule: "*/5 * * * *"
  successfulJobsHistoryLimit: 0
  concurrencyPolicy: Replace
  failedJobsHistoryLimit: 0
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: statuscakepush
              env:
                - name: statuscake
                  valueFrom:
                    secretKeyRef:
                      name: statuscake
                      key: url
              image: busybox
              imagePullPolicy: IfNotPresent
              args:
                - /bin/sh
                - -c
                - wget -q "$(statuscake)"
          restartPolicy: OnFailure
```

statuscake-cronjob.yml

Run kubectl apply to create the cronjob

```BASH
kubectl apply -f statuscake-cronjob.yml
```
