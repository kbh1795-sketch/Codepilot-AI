import React from "react";
import { Code2, Bug, FileCode, Rocket } from "lucide-react";

const SUGGESTIONS = [
  { icon: Code2, title: "Build a React component", prompt: "Build a responsive navbar component in React with Tailwind CSS that collapses into a mobile menu." },
  { icon: Bug, title: "Debug my code", prompt: "My Node.js Express server returns a 401 on every request even after login. Help me debug it." },
  { icon: FileCode, title: "Write a function", prompt: "Write a Python function that parses a CSV file and returns a list of dictionaries, handling quoted fields." },
  { icon: Rocket, title: "Design an API", prompt: "Design a REST API for a task management app with endpoints for creating, listing, updating and deleting tasks." },
];

export default function ChatEmptyState({ onPick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-zinc-950 shadow-lg shadow-emerald-900/30">
        <Code2 className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-semibold text-zinc-100">What shall we build?</h2>
      <p className="mt-2 text-center text-sm text-zinc-500">
        Describe a feature, paste an error, or ask for a snippet — SuperAgent will write the code.
      </p>
      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              onClick={() => onPick(s.prompt)}
              className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-800/40"
            >
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400/80 group-hover:text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">{s.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{s.prompt}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}