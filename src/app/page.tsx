import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog";

export default async function Home() {
  const posts = await getBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Platform Lead 🚀
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Developer with a passion for DevOps, Cloud Computing and Automation.
          Building scalable infrastructure and empowering teams to ship faster.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/blog">
              Read the Blog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">About Me</Link>
          </Button>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col">
              <CardHeader>
                <div className="flex gap-2 mb-2">
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
          ))}
        </div>
      </section>
    </div>
  );
}
