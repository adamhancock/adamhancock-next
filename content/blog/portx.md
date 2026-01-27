---
title: "PortX \U0001F680 - Open port testing CLI"
date: '2020-04-05'
tags:
  - Software
excerpt: Port testing
---
# PortX 🚀 - Open port testing CLI

PortX provides an easy way to test for open TCP ports from the command line. It's written in NodeJS and compiled with Zeit's PKG. All dependencies are bundled in with the binary or can be installed automatically with NPM.

### Install

Download the latest binary for your operating system from [https://github.com/adamhancock/portx/release](https://github.com/adamhancock/portx/releases)s

MacOS and Linux - chmod +x the portx executable and mv it to /usr/local/bin/portx

Alternatively you can install using NPM. Run the following command to install

```
# Linux and MacOS systems 
sudo npm install -g portx

# Windows 
npm install -g portx

```

### Usage

PortX can be used directly from the command line or via a JSON file with predefined ports and templating. 

## CLI

```
portx -h google.co.uk:443
 SUCCESS - google.co.uk - 216.58.210.35:443 is accessible

```

### Looping tests

You can loop the test by running the following command (MacOS and Linux)

```
while true; do portx -h google.co.uk:443; sleep 1; done


```

### HTTP status checks

Portx can check for http responses by adding the -s flag.

```
portx -h adamhancock.co.uk:80 -s      
* SUCCESS - adamhancock.co.uk - 104.27.187.170:80 is accessible. HTTP: 200 OK
* SUCCESS - adamhancock.co.uk - 104.27.186.170:80 is accessible. HTTP: 200 OK

# with https
portx -h adamhancock.co.uk:443 -s https
* SUCCESS - adamhancock.co.uk - 104.27.186.170:443 is accessible. HTTP: 200 OK
* SUCCESS - adamhancock.co.uk - 104.27.187.170:443 is accessible. HTTP: 200 OK

```

## File templates

This is an example of a json file that portx supports with environment tags.

```
[
  {
    "name": "Yahoo",
    "host": "{{env}}.bbc.co.uk",
    "port": 443
  }
]

```

The JSON file can be passed to portx using the -f flag. Environments are defined using the -e flag. 

```
portx -f hosts.json -e dev,prd
* FAIL - PRD - Yahoo - prd.bbc.co.uk does not resolve
* SUCCESS - DEV - Yahoo - dev.bbc.co.uk - 212.58.228.21:443 is accessible.

```
