import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBlogPostWithMDX, getBlogPosts } from "@/lib/blog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostWithMDX(slug);
  
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Adam Hancock`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostWithMDX(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      <header className="space-y-4 mb-8">
        <div className="flex gap-2">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <Separator className="mb-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
        {post.content}
      </div>
    </article>
  );
}
