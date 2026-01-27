import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

export const metadata = {
  title: "About | Adam Hancock",
  description: "Founding Engineer with a passion for DevOps, Cloud Computing and Automation.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <p className="text-xl text-muted-foreground">
          Founding Engineer with a passion for DevOps, Cloud Computing and Automation.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I'm a developer who loves building scalable infrastructure and empowering 
          teams to ship faster. Currently working as a Founding Engineer at Assurix, 
          building a cyber assurance platform.
        </p>

        <p>
          I write about Kubernetes, DevOps, cloud computing, and the tools I use 
          to automate my life. When I'm not coding, you'll find me tinkering with 
          home automation or experimenting with AI assistants.
        </p>

        <h2>Tech Stack</h2>
        <ul>
          <li>Kubernetes & Docker</li>
          <li>TypeScript & Node.js</li>
          <li>Terraform & Infrastructure as Code</li>
          <li>Azure, GCP & AWS</li>
          <li>GitOps with FluxCD</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out if you want to chat about DevOps, Kubernetes, 
          or anything tech-related.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <a href="https://github.com/adamhancock" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://linkedin.com/in/adam-hancock" target="_blank" rel="noopener noreferrer">
            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:adam@adamhancock.co.uk">
            <Mail className="mr-2 h-4 w-4" /> Email
          </a>
        </Button>
      </div>
    </div>
  );
}
