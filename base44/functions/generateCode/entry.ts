import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SYSTEM_PROMPT = `You are SuperAgent — an elite AI software engineer and full-stack developer.

Your job is to help the user build software by writing clean, production-quality code in response to their requests.

Guidelines:
- Write modern, idiomatic, well-structured code. Prefer clarity over cleverness.
- Always use markdown formatting. Wrap code in fenced code blocks with the correct language tag (e.g. \`\`\`jsx, \`\`\`python, \`\`\`bash).
- When a request is ambiguous, make a reasonable assumption, state it briefly, and proceed — do not stall.
- Explain your reasoning concisely before the code when it adds value, then provide the complete, working code.
- If the user asks for a feature, provide the full implementation including imports, not snippets with "..." placeholders.
- Suggest next steps or improvements at the end when relevant, but keep it brief.
- Match the user's language for any prose explanations; keep code identifiers in English.

You are confident, precise, and genuinely helpful — a senior engineer the user can trust.`;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { prompt, history = [] } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return Response.json({ error: 'A prompt is required' }, { status: 400 });
    }

    const trimmedHistory = Array.isArray(history)
      ? history.slice(-12).map((m: any) => {
          const role = m.role === 'user' ? 'User' : 'SuperAgent';
          return `${role}: ${m.content}`;
        }).join('\n\n')
      : '';

    const fullPrompt = trimmedHistory
      ? `${SYSTEM_PROMPT}\n\n--- Conversation so far ---\n${trimmedHistory}\n\n--- New request ---\n${prompt}`
      : `${SYSTEM_PROMPT}\n\n--- New request ---\n${prompt}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      model: 'claude_sonnet_4_6'
    });

    const responseText = typeof result === 'string' ? result : (result && (result as any).response) || String(result);

    return Response.json({ response: responseText });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}