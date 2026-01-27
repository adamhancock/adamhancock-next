import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4 md:mr-6 flex items-center">
            <span className="font-bold text-sm md:text-base">Adam Hancock</span>
          </Link>
          <nav className="flex items-center space-x-3 md:space-x-6 text-sm font-medium">
            <Link href="/blog" className="transition-colors hover:text-foreground/80">
              Blog
            </Link>
            <Link href="/projects" className="transition-colors hover:text-foreground/80">
              Projects
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9" asChild>
            <a href="https://github.com/adamhancock" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9" asChild>
            <a href="https://linkedin.com/in/adam-hancock" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
