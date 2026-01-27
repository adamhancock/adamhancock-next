import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export const metadata = {
  title: "Projects | Adam Hancock",
  description: "Open source projects and side projects by Adam Hancock.",
};

const projects = [
  {
    title: "Clawdbot",
    description: "A powerful personal AI assistant you can self-host. Control your smart home, manage calendars, browse the web, and more.",
    tags: ["TypeScript", "AI", "Automation"],
    github: "https://github.com/clawdbot/clawdbot",
    link: "https://clawd.bot",
  },
  {
    title: "Mailhooks",
    description: "Real-time email notifications via Server-Sent Events. No webhooks, no exposed ports.",
    tags: ["TypeScript", "Email", "SSE"],
    link: "https://mailhooks.dev",
  },
  // Add more projects here
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Open source projects and things I'm building.
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
