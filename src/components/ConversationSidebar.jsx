import React from "react";
import { Plus, MessageSquare, Trash2, Sparkles } from "lucide-react";

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-zinc-800/80 bg-zinc-950">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-zinc-950">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">SuperAgent</h1>
          <p className="text-xs text-zinc-500">AI coding engineer</p>
        </div>
      </div>

      <div className="px-3">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700/70 bg-zinc-900/50 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-800/60"
        >
          <Plus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
        <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-600">History</p>
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-600">No conversations yet.</p>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  c.id === activeId
                    ? "bg-zinc-800/80 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                }`}
              >
                <button
                  onClick={() => onSelect(c.id)}
                  className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
                  <span className="truncate">{c.title}</span>
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-zinc-500 hover:text-rose-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800/80 px-5 py-3">
        <p className="text-xs text-zinc-600">Powered by Claude Sonnet</p>
      </div>
    </aside>
  );
}