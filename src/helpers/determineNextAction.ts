import OpenAI from 'openpipe/openai';
import { useAppState } from '../state/store';
import { availableActions } from './availableActions';
import { ParsedResponseSuccess } from './parseResponse';

const formattedActions = availableActions
  .map((action, i) => {
    const args = action.args
      .map((arg) => `${arg.name}: ${arg.type}`)
      .join(', ');
    return `${i + 1}. ${action.name}(${args}): ${action.description}`;
  })
  .join('\n');

const systemMessage = `
You are a browser automation assistant.

You can use the following tools:

${formattedActions}

You will be be given a task to perform and the current state of the DOM. You will also be given previous actions that you have taken. You may retry a failed action up to one time.

This is an example of an action:

<Thought>I should click the add to cart button</Thought>
<Action>click(223)</Action>

You must always include the <Thought> and <Action> open/close tags or else your response will be marked as invalid.`;

export async function determineNextAction(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  simplifiedDOM: string,
  maxAttempts = 3,
  notifyError?: (error: string) => void
) {
  const state = useAppState.getState().settings;
  const model = state.selectedModel;
  const prompt = formatPrompt(taskInstructions, previousActions, simplifiedDOM);
  const openPipeKey = state.openPipeKey;

  async function callOpenAI() {
    const { openAIKey } = state;
    if (!openAIKey) {
      notifyError?.('No OpenAI key found');
      return null;
    }

    const openai = new OpenAI({
      apiKey: openAIKey,
      dangerouslyAllowBrowser: true,
      openpipe: {
        apiKey: openPipeKey ?? undefined,
      },
    });

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        { role: 'user', content: prompt },
      ],
      max_completion_tokens: 5000,
      reasoning_effort: model === 'o1' ? 'low' : undefined,
      temperature: model === 'o1' ? undefined : 0,
      stop: ['</Action>'],
      store: openPipeKey ? true : false,
    });

    return {
      usage: completion.usage,
      prompt,
      response: completion.choices[0].message?.content?.trim() + '</Action>',
    };
  }

  async function callGemini() {
    const { geminiKey } = state;
    if (!geminiKey) {
      notifyError?.('No Gemini key found');
      return null;
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: {
            role: 'user',
            content: systemMessage,
          },
        }),
      }
    );
    const data = await res.json();
    return {
      usage: undefined,
      prompt,
      response:
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() + '</Action>',
    };
  }

  async function callNim() {
    const { nimKey } = state;
    if (!nimKey) {
      notifyError?.('No NIM key found');
      return null;
    }
    const res = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nimKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
        }),
      }
    );
    const data = await res.json();
    return {
      usage: data.usage,
      prompt,
      response: data.choices?.[0]?.message?.content?.trim() + '</Action>',
    };
  }

  async function callOllama() {
    const { ollamaUrl } = state;
    const res = await fetch(`${ollamaUrl || 'http://localhost:11434'}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
      }),
    });
    const data = await res.json();
    return {
      usage: data.usage,
      prompt,
      response: data.choices?.[0]?.message?.content?.trim() + '</Action>',
    };
  }

  for (let i = 0; i < maxAttempts; i++) {
    try {
      let result = null;
      if (state.provider === 'openai') result = await callOpenAI();
      else if (state.provider === 'gemini') result = await callGemini();
      else if (state.provider === 'nim') result = await callNim();
      else result = await callOllama();
      if (result) return result;
    } catch (error: any) {
      console.log('determineNextAction error', error);
      if (error.message.includes('server error')) {
        if (notifyError) {
          notifyError(error.message);
        }
      } else {
        throw new Error(error.message);
      }
    }
  }
  throw new Error(
    `Failed to complete query after ${maxAttempts} attempts. Please try again later.`
  );
}

export function formatPrompt(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  pageContents: string
) {
  let previousActionsString = '';

  if (previousActions.length > 0) {
    const serializedActions = previousActions
      .map(
        (action) =>
          `<Thought>${action.thought}</Thought>\n<Action>${action.action}</Action>`
      )
      .join('\n\n');
    previousActionsString = `You have already taken the following actions: \n${serializedActions}\n\n`;
  }

  return `The user requests the following task:

${taskInstructions}

${previousActionsString}

Current time: ${new Date().toLocaleString()}

Current page contents:
${pageContents}`;
}
