import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Github, Linkedin, Mail, MapPin, Building2, Calendar } from "lucide-react";

export const metadata = {
  title: "About",
  description: "Founding engineer at Assurix. Building AI-assisted compliance software for MSPs and Mailhooks on the side.",
  alternates: {
    canonical: "/about",
  },
};

const techStack = [
  { name: "TypeScript", category: "Languages" },
  { name: "Node.js", category: "Languages" },
  { name: "Go", category: "Languages" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "NestJS", category: "Backend" },
  { name: "Prisma", category: "Backend" },
  { name: "PostgreSQL", category: "Data" },
  { name: "Redis", category: "Data" },
  { name: "Kubernetes", category: "Infrastructure" },
  { name: "Docker", category: "Infrastructure" },
  { name: "Terraform", category: "Infrastructure" },
  { name: "Azure", category: "Cloud" },
  { name: "GCP", category: "Cloud" },
  { name: "AWS", category: "Cloud" },
  { name: "OpenAI", category: "AI" },
  { name: "LLMs", category: "AI" },
  { name: "FluxCD", category: "GitOps" },
  { name: "Prometheus", category: "Observability" },
];

const timeline = [
  {
    role: "Founding Engineer",
    company: "Assurix",
    period: "Jul 2025 - Present",
    description: "Building the core platform that enables Managed Service Providers (MSPs) to prove they are secure, mature, and resilient.",
  },
  {
    role: "Platform Lead",
    company: "Capgemini",
    period: "Nov 2022 - Jul 2025",
    description: "Led platform engineering initiatives, built internal developer platforms, and scaled Kubernetes infrastructure.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      {/* Hero Section */}
      <BlurFade delay={0.1}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Hey, I'm Adam 👋</h1>
            <p className="text-xl text-muted-foreground">
              Founding engineer at Assurix, building AI-assisted compliance
              software for MSPs.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Brighton, UK
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" /> Assurix
              </span>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Bio */}
      <BlurFade delay={0.2}>
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Founding engineer at Assurix. I own the platform end to end: API,
            frontend, cloud infrastructure, and the AI that reviews compliance
            evidence. Assurix helps MSPs prove they are secure, mature and
            resilient.
          </p>
          <p>
            Outside work I build Mailhooks, an email to webhook API, and
            OpenClaw, a self-hosted AI assistant. I write about what I build,
            mostly DevOps and Kubernetes.
          </p>
          <p>
            A lot of it is open source. GitHub is the best place to see what
            I'm up to.
          </p>
        </div>
      </BlurFade>

      {/* Experience Timeline */}
      <BlurFade delay={0.3}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.role}</h3>
                      <p className="text-muted-foreground">{item.company}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {item.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Tech Stack */}
      <BlurFade delay={0.4}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech.name} variant="secondary" className="text-sm py-1 px-3">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Values / What I Care About */}
      <BlurFade delay={0.5}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">What I Care About</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🚀 Developer Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Building platforms that make developers' lives easier. Fast feedback loops, 
                  self-service infrastructure, and minimal friction.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🔧 Automation</h3>
                <p className="text-sm text-muted-foreground">
                  If I have to do something twice, I'll automate it. GitOps, Infrastructure 
                  as Code, and CI/CD pipelines are my bread and butter.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">📖 Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  OpenClaw and most of my other side projects are open source.
                  I've learned a lot from other people's code and try to pay it
                  forward.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🏠 Home Automation</h3>
                <p className="text-sm text-muted-foreground">
                  Smart home enthusiast running Home Assistant on Kubernetes. Yes, it's 
                  overkill. No, I don't care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </BlurFade>

      {/* Contact */}
      <BlurFade delay={0.6}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
          <p className="text-muted-foreground">
            Questions, hiring, or building something with email and webhooks?
            My inbox is open.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:adam@adamhancock.co.uk">
                <Mail className="mr-2 h-4 w-4" /> Email Me
              </a>
            </Button>
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
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
