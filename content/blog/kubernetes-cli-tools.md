---
title: Kubernetes CLI Tools
date: '2020-05-04'
updated: '2026-01-30'
tags:
  - Kubernetes
excerpt: My recommended Kubernetes command line toolset
---
# Kubernetes CLI Tools

Developers love to build tooling for other developers; this means there's an infinite amount of tooling for Kubernetes.

This is my recommended toolset:

## Oh My Zsh

Not specifically a Kubernetes tool but still recommended. Oh my Zsh is an addon to Zsh (the default shell on macOS and many Linux distros). It allows you to easily add auto suggestions and tab completion to kubectl.

```bash
# Linux Users only
sudo apt-get install -y zsh

# Oh my zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Zsh completions plugin
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions

# Zsh auto suggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

You then need to update your `.zshrc` config to load the plugins:

```bash
nano ~/.zshrc
```

Find the plugins line and update it:

```bash
plugins=(git kubectl zsh-completions zsh-autosuggestions)

# Also load the kubectl completion
source <(kubectl completion zsh)
```

## K9s

K9s is a terminal-based UI that makes navigating and managing Kubernetes clusters a breeze. It provides a real-time view of your cluster resources, logs, and even lets you exec into pods. It's become an essential tool in my daily workflow.

```bash
# macOS
brew install derailed/k9s/k9s

# Linux (via binary)
curl -sS https://webi.sh/k9s | sh

# Or via package managers
# Arch
pacman -S k9s

# Debian/Ubuntu (via Webi or download from GitHub releases)
```

Once installed, just run `k9s` and use `:` to search for resources (e.g., `:pods`, `:deploy`, `:svc`). Press `?` for help.

## KubeCTX & KubeNS

If you work with multiple clusters then kubectx is a must have. Kubectx allows you to switch between clusters easily. Kubens is the sister tool that can quickly switch between namespaces.

```bash
# macOS
brew install kubectx

# Linux (manual install)
sudo git clone https://github.com/ahmetb/kubectx /opt/kubectx
sudo ln -s /opt/kubectx/kubectx /usr/local/bin/kubectx
sudo ln -s /opt/kubectx/kubens /usr/local/bin/kubens

# Or via krew (kubectl plugin manager)
kubectl krew install ctx
kubectl krew install ns
```

Pro tip: Both tools support fuzzy finding with [fzf](https://github.com/junegunn/fzf) - install it for an even better experience.

## Stern

Stern allows you to tail logs from multiple pods simultaneously. Each pod is colour-coded making it easy to follow logs across a deployment. Queries support regular expressions so you don't need exact pod names.

```bash
# macOS
brew install stern

# Linux
STERN_VERSION=$(curl -s https://api.github.com/repos/stern/stern/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -Lo stern https://github.com/stern/stern/releases/download/${STERN_VERSION}/stern_linux_amd64
chmod +x stern
sudo mv stern /usr/local/bin/

# Or via krew
kubectl krew install stern
```

Usage example:

```bash
# Tail all pods matching "api" in current namespace
stern api

# Tail pods in a specific namespace
stern -n production api

# Include timestamps
stern -t api
```

## Helm

Helm to Kubernetes is like APT is to Ubuntu. Helm Charts are community maintained ready-to-go applications. Charts assist you with installing and keeping up-to-date complex applications.

```bash
# macOS
brew install helm

# Linux (official script)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Or via apt (Debian/Ubuntu)
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## Kube-PS1

Kube-ps1 displays the cluster and namespace context currently active in your terminal prompt. It's extremely useful when managing multiple clusters to avoid running commands against the wrong environment.

```bash
# macOS
brew install kube-ps1

# Linux
git clone https://github.com/jonmosco/kube-ps1.git ~/.kube-ps1
echo 'source ~/.kube-ps1/kube-ps1.sh' >> ~/.zshrc
echo "PROMPT='\$(kube_ps1)'\$PROMPT" >> ~/.zshrc
```

You can toggle the prompt on and off:

```bash
kubeon   # Show cluster/namespace in prompt
kubeoff  # Hide it
```

If you want it off by default, add `kubeoff` to your `.zshrc`.

## Krew (Bonus)

[Krew](https://krew.sigs.k8s.io/) is the plugin manager for kubectl. Many of the tools above can be installed via krew, and there are hundreds of useful plugins available.

```bash
# Install krew
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

# Add to PATH in your .zshrc/.bashrc
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
```

Then discover plugins with:

```bash
kubectl krew search
kubectl krew install <plugin-name>
```

Some useful plugins to try: `ctx`, `ns`, `neat`, `tree`, `images`, `whoami`.
