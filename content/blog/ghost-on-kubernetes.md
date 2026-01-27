---
title: "Hosting a Blog on Kubernetes \U0001F9D1‍\U0001F4BB"
date: '2020-08-06'
tags:
  - Kubernetes
  - Azure
excerpt: Hosting a Ghost blog on Kubernetes
---
# Hosting a Blog on Kubernetes 🧑‍💻

This blog is running the NodeJS based software called Ghost. It's hosted on a Digital Ocean droplet with [Rancher's k3s](https://www.k3s.io/). My goal with the setup was to remove all state from the container running Ghost and allow it to scale up if needed.

Out of the box Ghost will store all its configuration and data under _/var/lib/ghost/content._ You can mount a persistent volume in Kubernetes under this path however the backup story is much easier by removing state altogether. 

This blog post will demonstrate how to achieve setting up a stateless container by moving images to a CDN (this blog uses Azure CDN) and a MySQL database. 

### Prerequisites

* Kubernetes environment (k3s or K8s is fine)
* MySQL host and database.
* Azure Blob Storage Account with Azure CDN setup.
* Docker and kubectl installed locally

### Deploying Ghost

You'll need the following YAML to create the deployment, service, ingress and configmap in K8s.

To get started, download the below Gist: <https://gist.github.com/adamhancock/9f55709c3c9ef002eaefb04eb7b6b840>

In your editor, you will need to edit the configmap YAML with your database credentials and CDN address. 

The deployment and ingress YAML needs updating with your blog's domain.

You will need to create a secret with your Azure Blob Storage connection string. Run the following kubectl command to create it. 

```
kubectl create secret generic azure --from-literal=AZURE_STORAGE_CONNECTION_STRING="changeme"
```

This secret is referenced in the deployment YAML and will inject the environment variable AZURE\_STORAGE\_CONNECTION\_STRING for the [Azure ghost storage plugin](https://www.npmjs.com/package/ghost-storage-azure). 

Make sure your terminal is in the YAML directory and apply the updated YAML with 

```
kubectl apply -f . 
```

Your blog should be available at your domain, browse to /ghost to run the admin setup guide. 

### Adding your own theme

To add your theme to ghost, you will need to create your own container image and upload your image. 

Upload the theme (zipped) normally through the ghost admin portal 

Fork the repository: <https://github.com/adamhancock/ghost-azure-storage>

Update the _entrypoint-wrapper.sh_ script to copy your (uncompressed) theme into _/var/lib/ghost/_content/themes/. I'm using git to copy it in but you can also use the _COPY command inside the Dockerfile._ 

If you do use the Dockerfile method, you will need to copy it to an interim location and copy to the themes directory using the entrypoint script. The themes/content directory doesn't exist at the time the Dockerfile is executes. 

Build and push your new Docker image with 

```
 docker build . -t docker-hub-username/ghostblog && docker push docker-hub-username/ghostblog
```

Once you have the theme in your docker image, update the deployment YAML image with your _docker-hub-username_/ghostblog and apply it with 

```
kubectl apply -f ghost_deploy.yml
```

You can test that your theme stays applied by restarting your containers

```
kubectl rollout restart deploy ghost
```

### Known Issues

* If running multiple replicas, new posts show 404 when hitting the pods not aware of the new post.
