import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export default async function Home() {
  const posts = await getBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center -mx-4 md:-mx-8 px-4 md:px-8 -mt-4 md:-mt-8 overflow-hidden">
        <DotPattern
          className={cn(
            "absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "opacity-50"
          )}
        />
        <div className="relative z-10 space-y-6 py-12 md:py-20">
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-sm">
              <span className="mr-2">🚀</span>
              <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
                Founding Engineer @ Assurix
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              Hey, I'm Adam.
              <br />
              <span className="text-muted-foreground">I build products with AI.</span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Founding Engineer crafting the future of cyber assurance. 
              Writing about DevOps, Kubernetes, and AI.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex gap-4 flex-wrap pt-4">
              <Link href="/blog">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-base">
                    Read the Blog
                  </span>
                </ShimmerButton>
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors border border-input bg-background/80 backdrop-blur-sm shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-6"
              >
                About Me <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </BlurFade>
        </div>
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
              <Link href={`/blog/${post.slug}`} className="block">
                <Card className="flex flex-col h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
