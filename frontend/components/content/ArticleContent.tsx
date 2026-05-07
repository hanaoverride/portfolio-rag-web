"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedDate } from "@/components/common/FormattedDate";
import type { Content } from "@/lib/api/types";

interface ArticleContentProps {
  content: Content;
  className?: string;
}


export function ArticleContent({ content, className }: ArticleContentProps) {
  return (
    <article className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={content.author.avatar}
          alt={content.author.name}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {content.author.name}
          </span>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {content.author.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <FormattedDate date={content.createdAt} />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {content.category.map((cat) => (
          <span
            key={cat}
            className="inline-block rounded-md bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-display prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.bodyContent}
        </ReactMarkdown>
      </div>
    </article>
  );
}