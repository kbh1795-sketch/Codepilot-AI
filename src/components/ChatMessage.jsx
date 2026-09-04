import React from "react";
import { Bot, User } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white"
            : "bg-gradient-to-br from-zinc-700 to-zinc-900 text-emerald-400 ring-1 ring-zinc-700"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4.5 w-4.5" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "bg-gradient-to-br from-sky-600/90 to-indigo-700/90 text-white shadow-lg shadow-sky-950/30"
            : "border border-zinc-800 bg-zinc-900/60 text-zinc-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
}