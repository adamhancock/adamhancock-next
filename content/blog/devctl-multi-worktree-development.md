---
title: "Managing Multiple Git Worktrees with Caddy and devctl2"
date: "2026-01-28"
tags: ["DevTools", "Git", "Caddy", "Workflow"]
excerpt: "Git worktrees let you work on multiple branches simultaneously, but managing ports, databases, and routing for each one is painful. Here's how devctl2 automates the entire setup."
---

If you've ever worked on a large project with multiple feature branches, you've probably experienced the juggling act: switching branches, restarting services, losing your flow. Git worktrees solve the branch-switching problem — but they create new ones.

Each worktree needs its own ports, database, and routing. Managing this manually is tedious and error-prone. So I built [devctl2](https://github.com/adamhancock/cli/tree/main/packages/devctl2) to automate the entire setup.

## The Problem with Multiple Worktrees

Git worktrees are fantastic. Instead of stashing changes or committing half-finished work to switch branches, you can have multiple branches checked out simultaneously in separate directories:

```bash
git worktree add ../feature-auth feature/auth
git worktree add ../feature-dashboard feature/dashboard
```

Now you've got three copies of your codebase: `main`, `feature-auth`, and `feature-dashboard`. But when you try to run them:

- **Port conflicts**: All three want port 3000
- **Database collisions**: All three connect to the same database
- **Routing chaos**: How do you access each one in the browser?

You end up manually changing `.env` files, running on random ports, and losing track of what's running where.

## The Solution: Automatic Environment Isolation

devctl2 solves this by automatically provisioning each worktree with:

- **Unique ports** — deterministically allocated, no conflicts
- **Isolated database** — cloned from a template, per-worktree
- **Caddy routing** — automatic reverse proxy with subdomain support

### Quick Demo

```bash
# In your feature branch worktree
cd ../feature-auth
devctl2 setup

# ✓ Allocated ports: API=3042, Web=5042
# ✓ Created database: myproject_feature_auth
# ✓ Updated .env files
# ✓ Configured Caddy route: feature-auth.dev.local
```

Now `https://feature-auth.dev.local` routes to your feature branch, completely isolated from main.

## How It Works

### Deterministic Port Allocation

Instead of random ports or manual assignment, devctl2 uses a hash of the worktree path to generate consistent ports:

```
/projects/myapp/main         → ports 3000, 5000
/projects/myapp/feature-auth → ports 3042, 5042  
/projects/myapp/feature-dash → ports 3087, 5087
```

Same worktree always gets the same ports. Different worktrees never conflict.

### Database Per Worktree

Each worktree gets its own PostgreSQL database, cloned from a template:

```bash
# Template database with your schema + seed data
myproject_dev (template)

# Auto-created per worktree
myproject_main
myproject_feature_auth
myproject_feature_dashboard
```

This means you can:
- Test migrations without affecting other branches
- Have different data states for different features
- Never worry about schema conflicts

### Caddy Reverse Proxy

devctl2 uses Caddy's Admin API to dynamically add routes:

```
https://main.dev.local/*         → localhost:5000 (web)
https://main.dev.local/api/*     → localhost:3000 (api)

https://feature-auth.dev.local/* → localhost:5042 (web)
https://feature-auth.dev.local/api/* → localhost:3042 (api)
```

No manual Caddyfile editing. Routes are added instantly via the API.

## Setting Up devctl2

### 1. Install

```bash
npm install -g @adamhancock/devctl2
```

### 2. Configure Caddy

Enable the Admin API in your Caddyfile:

```caddyfile
{
    admin localhost:2019
}
```

devctl2 handles all routing dynamically via the Admin API — no manual route configuration needed.

### 3. Initialize Your Project

```bash
cd /path/to/your/project
devctl2 init my-project
```

This creates `.devctl2rc.json`:

```json
{
  "projectName": "my-project",
  "baseDomain": "dev.local",
  "databasePrefix": "myproject",
  "caddyApi": "http://localhost:2019",
  "portRanges": {
    "api": { "start": 3000, "count": 1000 },
    "web": { "start": 5000, "count": 1000 }
  },
  "envFiles": {
    "api": "packages/api/.env",
    "web": "packages/web/.env"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "user": "postgres",
    "templateDb": "myproject_dev"
  }
}
```

### 4. Setup Each Worktree

```bash
# Create worktree
git worktree add ../feature-x feature/x
cd ../feature-x

# Provision environment
devctl2 setup
```

Done. Your feature branch is running on its own ports with its own database.

## Useful Commands

```bash
# List all active routes
devctl2 list

# Get ports for a specific worktree
devctl2 ports feature-auth

# Remove a route when done
devctl2 remove feature-auth

# Dump database for backup/sharing
devctl2 dump

# Restore database from dump
devctl2 restore backup.sql

# Health check
devctl2 doctor
```

## Real-World Workflow

Here's how I use this daily:

**Starting a new feature:**
```bash
git worktree add ../feature-payments feature/payments
cd ../feature-payments
devctl2 setup
pnpm dev
# Working at https://feature-payments.dev.local
```

**Reviewing a PR:**
```bash
git worktree add ../pr-review origin/pr/123
cd ../pr-review
devctl2 setup
# Test the PR at https://pr-review.dev.local
```

**Cleaning up:**
```bash
devctl2 remove pr-review
git worktree remove ../pr-review
```

No more "which port is that running on?" No more database conflicts. No more context-switching overhead.

## Why Caddy?

I chose Caddy for a few reasons:

1. **Admin API** — Dynamic route management without reloading
2. **Automatic HTTPS** — Even for local development with `tls internal`
3. **Simple config** — No nginx.conf complexity
4. **Fast** — Written in Go, minimal overhead

The Admin API is the killer feature here. Adding a route is a single HTTP request:

```bash
curl -X POST "http://localhost:2019/config/apps/http/servers/srv0/routes" \
  -H "Content-Type: application/json" \
  -d '{"match":[{"host":["feature.dev.local"]}],"handle":[...]}'
```

devctl2 wraps this in a friendly CLI, but you can also integrate it into other tools.

## Get Started

```bash
# Install from npm
npm install -g @adamhancock/devctl2

# Initialize and go
cd your-project
devctl2 init
devctl2 setup
```

The README has full documentation: [github.com/adamhancock/cli/tree/main/packages/devctl2](https://github.com/adamhancock/cli/tree/main/packages/devctl2)

---

*devctl2 is available on [npm](https://www.npmjs.com/package/@adamhancock/devctl2) and [open source on GitHub](https://github.com/adamhancock/cli/tree/main/packages/devctl2). If you're managing multiple worktrees, give it a try — your future self will thank you.*
