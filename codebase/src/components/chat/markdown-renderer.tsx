'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

function linkifyRawUrls(rawText: string): string {
  if (!rawText) return '';
  // Biến các đường dẫn URL thô http/https không thuộc markdown link []() thành dạng markdown link [url](url)
  return rawText.replace(
    /(?<!\]\(|src="|href="|">)(https?:\/\/[^\s<>\)\]"]+)/gi,
    (url) => `[${url}](${url})`
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = linkifyRawUrls(content);

  return (
    <div className="prose prose-invert max-w-none text-slate-100 leading-relaxed text-sm sm:text-base space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...props }) => (
            <a
              {...props}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/60 underline-offset-4 font-semibold break-all transition-colors cursor-pointer inline-inline-flex items-center gap-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 px-2 py-0.5 rounded-md my-0.5 shadow-xs"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0 inline-block" />
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            <img
              {...props}
              src={src}
              alt={alt}
              className="rounded-lg max-w-full h-auto border border-slate-700/60 my-3 shadow-md block"
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
