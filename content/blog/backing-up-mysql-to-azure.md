---
title: Backing up a MySQL container to Azure ☁
date: '2020-08-05'
tags:
  - Azure
  - Kubernetes
  - Software
excerpt: Docker Container to backup MySQL databases to Azure Blob Storage
---
# Backing up a MySQL container to Azure ☁

<https://hub.docker.com/r/adamhancock/mysql-backup-to-azure>

[MySQL-backup-to-azure](https://github.com/adamhancock/mysql-backup-to-azure) is a docker container that will connect to your specified MySQL server, create a database dump of all your databases and write the contents to Azure Blob Storage.

### Prerequisites

* Azure Storage Account - you'll need to of created the storage account and create a container inside of it. Make a note of the storage account name and key.
* Kubernetes or Docker Enviromment.

### Docker

Docker is very easy to setup, you can schedule a cronjob to run at your desired backup interval. 

```
docker run -it --rm -e mysql_host=mysql -e mysql_user=root -e mysql_password=changeme -e azure_account=testblob -e azure_accountKey=changeme -e azure_container=backup adamhancock/mysql-backup-to-azure
```

Running the container

### Kubernetes

Kubernetes has the ability to run its own cronjobs. The below instructions schedule the container to run at midnight daily. 

Create the following YAML and update the values to your MySQL server and Azure Storage Account Credentials. 

```YAML
apiVersion: v1
kind: Secret
metadata:
  name: mysql-backup
type: Opaque
stringData:
  host: mysql
  user: root
  password: changeme
---
apiVersion: v1
kind: Secret
metadata:
  name: azure
type: Opaque
stringData:
  account: changeme
  accountKey: changeme
  container: backup
```

secrets.yml

```SHELL
kubectl apply -f secrets.yml
```

Apply the secrets to your K8s Server

Next we need to create the Kubernetes cronjob. You can apply this directly from the GitHub Repository.

```
kubectl apply -f https://raw.githubusercontent.com/adamhancock/mysql-backup-to-azure/master/k8s/cronjob.yml
```

The default schedule will run at midnight daily. This can be updated by editing the schedule value inside the K8s cronjob. 

```
kubectl edit cj mysql-backup-to-azure
```

Edit the K8s Cronjob
