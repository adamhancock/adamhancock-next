import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export default async function Home() {
  const posts = await getBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="space-y-4 md:space-y-6 py-6 md:py-12">
        <BlurFade delay={0.1}>
          <AnimatedGradientText className="mb-4">
            🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span className={cn(
              "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
            )}>
              Platform Lead
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hey, I'm Adam 👋
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Developer with a passion for DevOps, Cloud Computing and Automation.
            Building scalable infrastructure and empowering teams to ship faster.
          </p>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex gap-4 flex-wrap">
            <Link href="/blog">
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Read the Blog
                </span>
              </ShimmerButton>
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              About Me
            </Link>
          </div>
        </BlurFade>
      </section>

      {/* Recent Posts */}
      <section className="space-y-6">
        <BlurFade delay={0.5}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
            <Link 
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </BlurFade>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post, index) => (
            <BlurFade key={post.slug} delay={0.6 + index * 0.1}>
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
