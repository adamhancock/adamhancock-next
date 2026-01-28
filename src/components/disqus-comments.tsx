"use client";

import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";

interface DisqusCommentsProps {
  slug: string;
  title: string;
}

export function DisqusComments({ slug, title }: DisqusCommentsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <div className="text-muted-foreground">Loading comments...</div>
      </div>
    );
  }

  const disqusConfig = {
    url: `https://adamhancock.co.uk/blog/${slug}`,
    identifier: slug,
    title: title,
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <DiscussionEmbed 
        shortname="adamhancockcouk" 
        config={disqusConfig}
      />
    </div>
  );
}
