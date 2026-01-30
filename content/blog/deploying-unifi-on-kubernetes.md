---
title: Deploying UniFi Network Application on Kubernetes
date: '2020-02-02'
updated: '2026-01-30'
tags:
  - Kubernetes
  - UniFi
excerpt: Deploy the Ubiquiti UniFi Network Application on Kubernetes with MongoDB and SSL certificates.
---

# Deploying UniFi Network Application on Kubernetes

> **Updated January 2026**: This guide has been completely rewritten to use the new `linuxserver/unifi-network-application` image. The previous `linuxserver/unifi-controller` image was deprecated on January 1, 2024.

This guide walks through deploying the Ubiquiti UniFi Network Application on Kubernetes with an external MongoDB database.

## Architecture

The new UniFi Network Application requires an external MongoDB instance, so we'll deploy both:

```
┌─────────────────┐     ┌─────────────────────────────┐
│     MongoDB     │◄────│  UniFi Network Application  │
│   StatefulSet   │     │        StatefulSet          │
└─────────────────┘     └─────────────────────────────┘
         │                           │
         └───────────────────────────┴──► LoadBalancer / Ingress
```

## Prerequisites

- Kubernetes cluster (managed or bare metal)
- `kubectl` configured
- cert-manager (optional, for TLS on web UI)
- Persistent storage provisioner (or manually provisioned PVs)
- MetalLB or cloud load balancer (required for device adoption)

This guide works on both x86-64 and ARM64 (Raspberry Pi 4+) processors.

For bare metal, you should have MetalLB configured for LoadBalancer services. Take note of your ingress controller's external IP.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/adamhancock/UniFi-on-k8s.git
cd UniFi-on-k8s/yaml
```

### 2. Configure Secrets

Edit `unifi-secret.yaml` and set secure passwords:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: unifi-db-secret
type: Opaque
stringData:
  mongo-root-password: "your-secure-root-password"
  mongo-password: "your-secure-unifi-password"
```

### 3. Configure Ingress

Edit `unifi-ingress.yaml` and replace `unifi.yourdomain.tld` with your hostname. Update the cluster issuer if you're using a different cert-manager configuration:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: unifi-network-application
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/backend-protocol: HTTPS
spec:
  ingressClassName: nginx
  rules:
    - host: unifi.yourdomain.tld
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: unifi-network-application
                port:
                  number: 8443
  tls:
    - hosts:
        - unifi.yourdomain.tld
      secretName: unifi-tls
```

### 4. Configure Load Balancer (Bare Metal)

For bare metal with MetalLB, edit `unifi-service.yaml` and set your desired IP:

```yaml
spec:
  type: LoadBalancer
  loadBalancerIP: 192.168.1.100  # Your MetalLB IP
```

### 5. Deploy

```bash
# Create namespace
kubectl create namespace unifi

# Apply all manifests
kubectl apply -f . -n unifi
```

### 6. Wait for Pods

```bash
kubectl get pods -n unifi -w
```

Wait for both `unifi-db-0` and `unifi-network-application-0` to show `Running` status. The first startup may take a few minutes while MongoDB initializes.

### 7. Create DNS Record

Create a DNS A record pointing `unifi.yourdomain.tld` to your LoadBalancer IP:

```bash
kubectl get svc -n unifi unifi-network-application -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Your UniFi installation will be available at `https://unifi.yourdomain.tld`

## Device Adoption

For UniFi to adopt devices (access points, switches, etc.), you need to configure the Inform Host:

1. Log into the UniFi web UI
2. Go to **Settings → System → Advanced**
3. Set **Inform Host** to your LoadBalancer IP or a hostname accessible by your devices
4. Check the **Override** checkbox

### Manual Adoption

If devices aren't auto-discovered:

```bash
ssh ubnt@<device-ip>
set-inform http://<controller-ip>:8080/inform
```

The default device password is `ubnt`.

## Port Reference

| Port | Protocol | Purpose |
|------|----------|---------|
| 8443 | TCP | Web UI (HTTPS) |
| 8080 | TCP | Device communication (Inform) |
| 3478 | UDP | STUN |
| 10001 | UDP | AP discovery |
| 8843 | TCP | Guest portal HTTPS |
| 8880 | TCP | Guest portal HTTP |
| 6789 | TCP | Mobile throughput test |
| 5514 | UDP | Remote syslog |

## Traefik Ingress

If you're using Traefik instead of nginx-ingress, you need to configure it to accept the self-signed backend certificate:

```yaml
apiVersion: traefik.io/v1alpha1
kind: ServersTransport
metadata:
  name: unifi-transport
  namespace: unifi
spec:
  insecureSkipVerify: true
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: unifi
  namespace: unifi
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`unifi.yourdomain.tld`)
      kind: Rule
      services:
        - name: unifi-network-application
          port: 8443
          serversTransport: unifi-transport
  tls:
    certResolver: letsencrypt
```

## Migration from Old Controller

If you're migrating from the deprecated `linuxserver/unifi-controller` image:

1. **Take a full backup** from the old UniFi web UI (Settings → System → Backup)
2. Include history if you want to preserve statistics
3. Shut down the old controller completely
4. Deploy this new setup with a fresh database
5. Restore from backup using the setup wizard on first login

⚠️ **Important**: You cannot perform an in-place upgrade. Backup and restore is required.

## Troubleshooting

### MongoDB won't start on older CPUs

MongoDB >4.4 on x86_64 requires a CPU with AVX support. Some Celeron and older Pentium CPUs don't have this.

Check for AVX support:
```bash
grep -o avx /proc/cpuinfo | head -1
```

If there's no output, edit `mongodb-statefulset.yaml` and change:
```yaml
image: docker.io/mongo:4.4
```

### Devices not adopting

1. Verify port 8080 is accessible from your network
2. Check the Inform Host setting is correct and reachable
3. Ensure the LoadBalancer has an external IP:
   ```bash
   kubectl get svc -n unifi
   ```

### View logs

```bash
# UniFi application logs
kubectl logs -f unifi-network-application-0 -n unifi

# MongoDB logs  
kubectl logs -f unifi-db-0 -n unifi
```

## Links

- **GitHub Repository**: [github.com/adamhancock/UniFi-on-k8s](https://github.com/adamhancock/UniFi-on-k8s)
- **Docker Image**: [linuxserver/unifi-network-application](https://github.com/linuxserver/docker-unifi-network-application)
- **Ubiquiti**: [ui.com](https://ui.com/)
