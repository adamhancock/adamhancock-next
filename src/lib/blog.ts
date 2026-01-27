import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

const contentDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: string;
}

export interface BlogPostWithMDX extends Omit<BlogPost, 'content'> {
  content: React.ReactElement;
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  const posts = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        date: data.date ? new Date(data.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) : "",
        excerpt: data.excerpt || content.slice(0, 160) + "...",
        tags: data.tags || [],
        content,
        readingTime: calculateReadingTime(content),
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getBlogPostWithMDX(slug: string): Promise<BlogPostWithMDX | null> {
  if (!fs.existsSync(contentDirectory)) {
    return null;
  }

  const mdPath = path.join(contentDirectory, `${slug}.md`);
  const mdxPath = path.join(contentDirectory, `${slug}.mdx`);
  
  let filePath = "";
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(fileContent);

  const { content } = await compileMDX({
    source: rawContent,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, {
            theme: "github-dark",
            keepBackground: true,
          }],
        ],
      },
    },
  });

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date ? new Date(data.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) : "",
    excerpt: data.excerpt || rawContent.slice(0, 160) + "...",
    tags: data.tags || [],
    content,
    readingTime: calculateReadingTime(rawContent),
  };
}
