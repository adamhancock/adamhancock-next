---
title: Kubernetes CLI Tools
date: '2020-05-04'
tags:
  - Kubernetes
excerpt: My recommended Kubernetes command line toolset
---
# Kubernetes CLI Tools

Developers love to build tooling for other developers; this means there's an infinite amount of tooling for Kubernetes.

This is my recommended toolset: 

### **Oh My Zsh**

Not specifically a Kubernetes tool but still recommended. Oh my Zsh is an addon to Zsh (the default shell with MacOS). It allows you to easily add auto suggestions and tab completion to kubectl. 

Auto suggestions

```
## Linux Users only
sudo apt-get install -y zsh

# Oh my zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# Zsh completions plugin
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
# Zsh auto suggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

```

Install Oh my Zsh

You then need to update your .zshrc config to load the plugins. 

```
nano ~/.zshrc
```

Find the plugins line 

```
plugins=()
```

Update it to load the new plugins

```
plugins=(git kubectl zsh-completions zsh-autosuggestions)

# Also load the kubectl completion 
source <(kubectl completion zsh)


```

### **KubeCTX & KubeNS**

If you work with multiple clusters then Kubectx is a must have. Kubectx allows you to switch between clusters easily. Kubens is the sister tool that can quickly switch between namespaces. 

```
cd /tmp \
  && git clone https://github.com/ahmetb/kubectx \
  && cd kubectx \
  && mv kubectx /usr/local/bin/kubectx \
  && mv kubens /usr/local/bin/kubens \
  && cd .. \
  && rm -rf kubectx
```

Install KubeCTX & KubeNS

### **Stern**

Stern allows you to tail all the pods in a deployment concurrently. It's a must have for troubleshooting logs. Each pod will be colour coded in a unique colour. Queries are regular expression so you only need to know the exact pod ID.   

```
# MacOS
brew install stern

# Linux oneliner
STERN_VERSION=1.11.0
sudo curl -L -o /usr/local/bin/stern https://github.com/wercker/stern/releases/download/${STERN_VERSION}/stern_linux_amd64 \
  && sudo chmod +x /usr/local/bin/stern
```

Install Stern

### **Helm**

Helm to Kubernetes is like APT is to Ubuntu. Helm Charts are community maintained ready to go applications. Charts assist you with installing & keeping up to date complex applications. 

```Bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

Install Helm

### **Kube-PS1**

Kubeps1 displays the cluster and namespace context currently active in your terminal prompt. It's extremely useful when managing multiple clusters. 

```
git clone https://github.com/jonmosco/kube-ps1.git /opt/kube-ps1
echo "source /path/to/kube-ps1.sh" >> ~/.zshrc
PROMPT='$(kube_ps1)'$PROMPT >> ~/.zshrc

# You can turn kube-ps1 on and off by using the following commands
kube on

## off
kubeoff

```

Install Kube-PS1

If you want to manually activate kube-ps1 with kubeon, run the following command:

```
echo "kubeoff" >> ~/.zshrc
```
