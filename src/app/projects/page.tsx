import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export const metadata = {
  title: "Projects",
  description: "Things Adam Hancock is building: Mailhooks, OpenClaw and more.",
  alternates: {
    canonical: "/projects",
  },
};

const projects = [
  {
    title: "Mailhooks",
    description: "Email to webhooks without a mail server. Give it an email address and it sends an HTTP POST to your endpoint when mail arrives. No DNS, no MIME parsing, no infrastructure to run.",
    tags: ["Email", "Webhooks", "API"],
    link: "https://mailhooks.dev",
  },
  {
    title: "OpenClaw",
    description: "Self-hosted AI assistant. Control your smart home, manage your calendar, browse the web and automate the rest. Formerly Clawdbot.",
    tags: ["TypeScript", "AI", "Automation"],
    github: "https://github.com/openclaw/openclaw",
    link: "https://clawd.bot",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Things I'm building. Some of it is open source.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex gap-2">
                {project.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Code
                    </a>
                  </Button>
                )}
                {project.link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
