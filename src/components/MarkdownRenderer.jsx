import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "@/components/CodeBlock";

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed prose-headings:my-3 prose-headings:font-semibold prose-headings:text-zinc-100 prose-strong:text-zinc-100 prose-a:text-sky-400 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-amber-300 prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock code={code} language={match ? match[1] : ""} />;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <div className="my-2 leading-relaxed">{children}</div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}