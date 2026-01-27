"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/adamhancock",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/adam-hancock",
    label: "LinkedIn",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/adamhancock",
    label: "Twitter",
  },
  {
    icon: Mail,
    href: "mailto:adam@adamhancock.co.uk",
    label: "Email",
  },
];

export function SocialDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <Dock iconMagnification={60} iconDistance={100}>
        {socialLinks.map((link) => (
          <DockIcon key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-full rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-accent transition-colors"
              aria-label={link.label}
            >
              <link.icon className="size-5" />
            </a>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}
