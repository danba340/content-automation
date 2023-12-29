import openai_init from 'openai';
import { ENV } from './config.js';

const openai = new openai_init({ apiKey: ENV.OPENAI_API_KEY });

async function prompt(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    return completion;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function shortenForTitle(original: string) {
  const pre_prompt = '';
  const full_prompt = pre_prompt + original;
  const result = await prompt(full_prompt);
  console.log('Shortened title:', result);
  return result;
}
