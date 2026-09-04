import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "react-hot-toast";
import ConversationSidebar from "@/components/ConversationSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatEmptyState from "@/components/ChatEmptyState";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Load current user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Load conversations for the current user
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const me = user || (await base44.auth.me());
      const list = await base44.entities.Conversation.filter(
        { created_by_id: me.id },
        "-created_date",
        100
      );
      setConversations(list);
    } catch (e) {
      toast.error("Could not load conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user, loadConversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const msgs = await base44.entities.Message.filter(
          { conversation_id: activeId },
          "created_date",
          500
        );
        if (!cancelled) setMessages(msgs);
      } catch (e) {
        if (!cancelled) toast.error("Could not load messages");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleNew = () => {
    setActiveId(null);
    setMessages([]);
  };

  const handleSelect = (id) => {
    setActiveId(id);
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.Conversation.delete(id);
      await base44.entities.Message.deleteMany({ conversation_id: id });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) handleNew();
      toast.success("Conversation deleted");
    } catch (e) {
      toast.error("Could not delete conversation");
    }
  };

  const handleSend = async (text) => {
    setSending(true);
    let convId = activeId;
    let isNewConversation = false;

    try {
      // Create a conversation if none is active
      if (!convId) {
        const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
        const conv = await base44.entities.Conversation.create({ title });
        convId = conv.id;
        isNewConversation = true;
        setConversations((prev) => [conv, ...prev]);
        setActiveId(convId);
      }

      // Save user message
      const userMsg = await base44.entities.Message.create({
        conversation_id: convId,
        role: "user",
        content: text,
      });
      setMessages((prev) => [...prev, userMsg]);

      // Build history for context (previous messages before this one)
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      // Call the agent
      const res = await base44.functions.invoke("generateCode", {
        prompt: text,
        history,
      });
      const responseText = res?.data?.response;
      if (!responseText) throw new Error("No response from agent");

      // Save assistant message
      const assistantMsg = await base44.entities.Message.create({
        conversation_id: convId,
        role: "assistant",
        content: responseText,
      });
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      toast.error(e?.message || "Something went wrong");
      // If we created a conversation but failed, clean up only the empty new one
      if (isNewConversation && convId && messages.filter((m) => m.conversation_id === convId).length === 0) {
        try {
          await base44.entities.Conversation.delete(convId);
          setConversations((prev) => prev.filter((c) => c.id !== convId));
          setActiveId(null);
        } catch {}
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      <main className="flex flex-1 flex-col">
        {messages.length === 0 && !sending ? (
          <div className="flex-1 overflow-y-auto">
            <ChatEmptyState onPick={handleSend} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
              {messages.map((m) => (
                <ChatMessage key={m.id} role={m.role} content={m.content} />
              ))}
              {sending && (
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-emerald-400 ring-1 ring-zinc-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-3.5 text-sm text-zinc-500">
                    SuperAgent is thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <ChatInput onSend={handleSend} disabled={sending} />
      </main>
    </div>
  );
}