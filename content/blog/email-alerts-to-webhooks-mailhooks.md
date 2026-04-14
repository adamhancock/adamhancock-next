---
title: "Send Email Alerts to Webhooks with Mailhooks (No Mail Server Required)"
date: "2026-04-12"
tags: ["Email", "Webhooks", "Automation", "Mailhooks"]
excerpt: "Need to trigger a webhook when an email arrives? Here's how to turn any email into a webhook notification — with or without your own SMTP server."
---

You've got a system that sends email alerts. Cron jobs, server monitors, CI pipelines, security scanners — they all love to send email. But your automation platform speaks webhooks, not IMAP.

The traditional approach is painful: set up a mail server, configure DNS records, parse MIME messages, handle attachments, and hope nothing breaks. There's a better way.

## What You'll Learn

- How to send email alerts directly to a webhook URL
- Three ways to send the emails (including one that needs zero infrastructure)
- A complete n8n integration example with real workflows

## The Key Idea: Mailhooks

[Mailhooks](https://mailhooks.dev) gives you a dedicated email address that forwards every received email to your webhook URL. No mail server, no DNS configuration, no MIME parsing — just send an email, get a webhook.

It works like this:

```
Your app → email → Mailhooks → HTTP POST → Your webhook
```

You get an email address like `alerts@yourname.mailhooks.email`. Anything sent there triggers an HTTP POST to whatever webhook URL you configure. The payload includes the subject, body (HTML and plain text), sender, attachments, and all headers — all nicely parsed as JSON.

## Step 1: Set Up Mailhooks

1. Sign up at [mailhooks.dev](https://mailhooks.dev) — free tier includes 100 emails/month
2. Create a new webhook endpoint and paste your webhook URL
3. You'll get a dedicated email address — something like `anything@yourname.mailhooks.email`

That's it on the Mailhooks side. Now you need to send emails to that address.

## Step 2: Send Emails — Three Ways

This is where most guides stop. "Just send an email!" they say. But *how* you send that email matters. Here are three approaches, from simplest to most flexible.

### Option A: Direct SMTP (Easiest — No Server Needed)

Most people think you need a mail server to send email. You don't. You can connect directly to Mailhooks' MX servers and deliver the email yourself — no authentication, no SMTP relay, no SendGrid account.

Here's a TypeScript script that does exactly that:

```typescript
import { createTransport } from "nodemailer"

async function sendAlert(
  subject: string,
  body: string,
  toAddress: string,
) {
  // Connect directly to Mailhooks' MX server.
  // No authentication required for direct delivery.
  const transporter = createTransport({
    host: "inbound.mailhooks.dev",
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  })

  await transporter.sendMail({
    from: "alerts@your-server.local",
    to: toAddress,
    subject,
    text: body,
  })
}

// Usage
await sendAlert(
  "🚨 Server CPU at 95%",
  "prod-web-01 CPU usage has exceeded 95% for 5 minutes.",
  "alerts@yourname.mailhooks.email",
)
```

**How does this work?** SMTP was designed for servers to talk directly to each other. When you send an email, your mail server looks up the MX records for the recipient's domain and connects directly. Mailhooks accepts inbound connections on port 25 — that's how email works. No authentication is needed because you're delivering mail *to* the server, not *through* it.

This is great for:
- Servers and VMs where you can't install a mail relay
- Docker containers without an MTA
- Scripts running in CI/CD pipelines
- Anywhere you want zero-dependency email delivery

**Important:** Some cloud providers (AWS, GCP, Azure) block outbound port 25 by default to prevent spam. If you're on a cloud VM, you may need to request the block be lifted or use Option B instead.

### Option B: Use an Existing SMTP Relay

If you already have access to an SMTP server — your Gmail account, a SendGrid transactional email setup, or a Postfix relay on your network — just use that:

```bash
# Using a relay with authentication
echo "Server disk at 90%" | mail \
  -s "⚠️ Disk Space Alert" \
  -a "From: alerts@yourdomain.com" \
  alerts@yourname.mailhooks.email
```

Or with TypeScript and a relay:

```typescript
import { createTransport } from "nodemailer"

async function sendViaRelay(opts: {
  subject: string
  body: string
  toAddress: string
  smtpHost: string
  smtpPort: number
  user: string
  password: string
}) {
  const transporter = createTransport({
    host: opts.smtpHost,
    port: opts.smtpPort,
    secure: false, // use STARTTLS on the connection
    auth: { user: opts.user, pass: opts.password },
  })

  await transporter.sendMail({
    from: opts.user,
    to: opts.toAddress,
    subject: opts.subject,
    text: opts.body,
  })
}

// Example: using Gmail
await sendViaRelay({
  subject: "Build Failed",
  body: "Pipeline #42 failed at step 3.",
  toAddress: "alerts@yourname.mailhooks.email",
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  user: "you@gmail.com",
  password: "your-app-password",
})
```

This works everywhere — no port 25 restrictions to worry about.

### Option C: Forward Existing Alerts

Already getting alert emails? Don't change the source — just forward them:

1. Set up a forwarding rule in Gmail/Outlook to forward matching emails to your Mailhooks address
2. Configure your monitoring tool (Uptime Kuma, Zabbix, etc.) to send alerts to the Mailhooks address instead of (or in addition to) your regular email

No code changes needed. The emails arrive at Mailhooks and get pushed to your webhook.

## Step 3: Handle the Webhook Payload

When an email arrives at your Mailhooks address, it POSTs a JSON payload to your webhook URL. Here's what it looks like:

```json
{
  "id": "msg_abc123",
  "from": "alerts@your-server.local",
  "to": "alerts@yourname.mailhooks.email",
  "subject": "🚨 Server CPU at 95%",
  "text": "prod-web-01 CPU usage has exceeded 95% for 5 minutes.",
  "html": "<p>prod-web-01 CPU usage has exceeded 95% for 5 minutes.</p>",
  "attachments": [],
  "receivedAt": "2026-04-12T09:30:00Z"
}
```

### n8n Integration

[n8n](https://n8n.io) is a popular self-hostable workflow automation tool. Mailhooks delivers pre-parsed email data to n8n's webhook trigger instantly — no IMAP polling, no OAuth tokens, no MIME parsing.

**Setup:**

1. In n8n, add a **Webhook** trigger node (HTTP Method: **POST**)
2. Copy the **Production URL**
3. In Mailhooks, create an inbox → add a **Webhook** hook → paste the n8n URL
4. You'll get an email address like `alerts@yourname.mailhooks.email`

**Access email data in n8n expressions:**

In your subsequent n8n nodes, access email data with n8n expressions (wrap in double curly braces):

- `$json.subject` — Subject line
- `$json.from` — Sender
- `$json.text` — Plain text body
- `$json.html` — HTML body
- `$json.attachments[0].url` — First attachment download URL
- `$json.attachments[0].filename` — First attachment filename

**Example: Route alerts by severity**

```
[Webhook Trigger]
  → [Switch on subject field]
    ├─ Contains "CRITICAL" → [Slack: #incidents] + [PagerDuty]
    ├─ Contains "WARNING"  → [Slack: #alerts] + [PostgreSQL: log]
    └─ Default            → [Google Sheets: log all]
```

**Example: Save attachments to Google Drive**

```
[Webhook Trigger]
  → [IF: attachments exist?]
    → [HTTP Request: download attachment URL]
      → [Google Drive: upload file]
```

**Pro tips:**
- Use catch-all addresses (`*@yourname.mailhooks.email`) to route different addresses to the same workflow, then branch on the `to` field
- Attachment URLs expire after 24 hours — download them promptly in your workflow
- If n8n is down, Mailhooks queues and retries with exponential backoff for up to 24 hours

**Why this beats n8n's built-in IMAP node:**

| Feature | Mailhooks Webhook | n8n IMAP Node |
|---|---|---|
| Latency | Instant (under 10s) | Polling interval |
| Setup | 2 minutes | Complex OAuth/IMAP |
| Attachments | Direct URLs | Manual extraction |
| Email parsing | Pre-parsed JSON | Raw MIME |
| Reliability | Queued + retries | Requires n8n uptime |

## When to Use Each Sending Method

| Method | Best For | Limitations |
|--------|----------|-------------|
| **Direct SMTP** | Servers, scripts, CI/CD — zero dependencies | Cloud providers may block port 25 |
| **SMTP Relay** | Gmail users, existing mail infra | Needs credentials, depends on relay uptime |
| **Forwarding** | Existing alert emails, no-code setup | Slight delay from forwarding chain |

## Real-World Use Cases

- **Server monitoring** → Cron job detects high CPU → sends email via direct SMTP → Mailhooks → n8n → Slack/Discord/PagerDuty
- **CI/CD failures** → GitHub Action sends email on build failure → Mailhooks → n8n → create Jira ticket + notify team
- **Security alerts** → Fail2ban sends ban notifications → Mailhooks → n8n → log to database + alert security channel
- **Form submissions** → Website form handler sends email → Mailhooks → n8n → save to Google Sheets + send notification

## Why Not Just Use Gmail Filters?

Good question. Gmail filters can forward emails, but:

- **Gmail's forwarding is slow** — sometimes 5-15 minute delays
- **No webhook support** — you'd still need something to turn the forwarded email into a webhook call
- **Authentication hell** — app passwords, OAuth, 2FA complications
- **Rate limits** — Gmail isn't designed for automated alert forwarding at scale
- **No programmatic control** — can't dynamically change webhook URLs or routing

Mailhooks gives you instant delivery, webhook-native output, and an API to manage everything programmatically.

## Get Started

1. Sign up at [mailhooks.dev](https://mailhooks.dev)
2. Create a webhook endpoint with your destination URL
3. Send a test email to your Mailhooks address
4. Watch it arrive at your webhook in seconds

The free tier handles 100 emails/month — more than enough for alert notifications and testing. Need more? Paid plans start from there.

---

Stop polling your inbox. Stop maintaining mail servers. Send alerts to webhooks the easy way.