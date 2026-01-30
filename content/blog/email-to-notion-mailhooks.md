---
title: "How to Automatically Save Emails to Notion (No Code Required)"
date: "2026-01-30"
tags: ["Notion", "Email", "Automation", "Productivity"]
excerpt: "Stop manually copy-pasting emails into Notion. Set up automatic email-to-Notion sync in under 5 minutes with Mailhooks."
---

You're probably here because you've been manually copying emails into Notion. Receipts, order confirmations, newsletters, client emails — valuable information buried in your inbox that you want in your knowledge base.

The manual process is tedious:
1. Open email
2. Copy subject, sender, date
3. Switch to Notion
4. Create new entry
5. Paste everything
6. Repeat forever

What if emails just... appeared in Notion automatically?

## The Solution: Mailhooks + Notion Integration

[Mailhooks](https://mailhooks.dev) is a developer email API that can receive emails and push them anywhere — including directly into a Notion database. No code required.

Here's what the setup looks like:

1. Connect your Notion workspace to Mailhooks
2. Create (or select) a database for your emails
3. Get a dedicated email address
4. Forward emails to that address (or use it directly)

That's it. Emails land in your Notion database within seconds.

## Step-by-Step Setup

### 1. Create a Mailhooks Account

Head to [mailhooks.dev](https://mailhooks.dev) and sign up. The free tier includes 100 emails/month — plenty for testing, and enough for light personal use.

### 2. Add a Domain (or Use the Default)

You can receive emails at addresses like `anything@yourname.mailhooks.email` immediately. If you want to use your own domain, add it in the dashboard and configure the MX records.

### 3. Connect Notion

Go to **Integrations → Notion** and click "Connect Workspace". You'll be redirected to Notion to authorize Mailhooks.

When authorizing, make sure to grant access to the pages/databases where you want emails stored. Notion's permissions are granular — Mailhooks can only see what you explicitly share.

### 4. Create a Notion Hook

Click **Add Hook → Notion Database**. You have two options:

**Create New Database** — Mailhooks sets up a pre-configured database with columns for Subject, From, To, Date, and Message ID. Just pick which Notion page to create it in.

**Use Existing Database** — Already have a database? Map your existing columns to email fields. You'll need at least a title property for the subject line.

### 5. Configure Routing (Optional)

Want to filter which emails go to Notion? Set up routing rules:

- **To:** `*@receipts.yourdomain.com` — only emails to this address
- **From:** `*@amazon.com` — only emails from Amazon
- **Subject:** `Order Confirmation` — only emails containing this text

Leave these empty to capture all emails.

### 6. Get Your Email Address

Your hook is now active. Emails sent to your Mailhooks address (or forwarded there) will automatically appear in your Notion database.

## Example Use Cases

### 📧 Receipt Archive
Create a "Receipts" database. Forward purchase confirmations from Amazon, Apple, subscriptions — all searchable in Notion.

### 📰 Newsletter Inbox
Subscribe to newsletters with your Mailhooks address. They'll collect in a Notion database where you can read them later, tag them, or share with your team.

### 🎫 Travel Itineraries
Forward flight confirmations, hotel bookings, and rental car emails to a "Travel" database. Everything for your trip in one place.

### 📋 Client Communications
Create a CRM-style database for client emails. Filter by sender domain to capture only work-related messages.

### 🛒 Order Tracking
Track all your online orders in one database. Filter for emails containing "shipped" or "delivered" in the subject.

## What Gets Captured?

Each email creates a new entry in your Notion database with:

| Field | Description |
|-------|-------------|
| Subject | Email subject line (title property) |
| From | Sender's email address |
| To | Recipient address |
| Date | When the email was sent |
| Message ID | Unique identifier for deduplication |
| Body | Full email content (as a page) |

Attachments? Coming soon — for now, links to attachments are included in the email body.

## Pro Tips

### Use Email Aliases
Most email providers support `+` aliases. Forward `you+receipts@gmail.com` to Mailhooks, then filter Gmail to auto-forward anything sent there.

### Set Up Multiple Hooks
Create different databases for different email types. One for receipts, one for newsletters, one for client emails — each with its own routing rules.

### Combine with Notion Automations
Use Notion's built-in automations to trigger actions when emails arrive. Send a Slack notification, update a status, or create related tasks.

## Pricing

Mailhooks offers a generous free tier:
- **Free:** 100 emails/month, 1 domain
- **Pro:** 10,000 emails/month, unlimited domains, priority support

For most personal use cases, free is enough. If you're running a business workflow, Pro has you covered.

## Get Started

1. Sign up at [mailhooks.dev](https://mailhooks.dev)
2. Connect your Notion workspace
3. Create your first hook
4. Start forwarding emails

The whole setup takes under 5 minutes. Your Notion workspace is about to get a lot more useful.

---

*Questions? Reach out on [Twitter](https://twitter.com/adamhancock) or check the [Mailhooks docs](https://docs.mailhooks.dev).*
