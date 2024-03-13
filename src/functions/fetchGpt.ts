import { createParser } from 'eventsource-parser'

type GptResponse = { choices: [{ message: { content: string } }] }
type GptStreamResponse = { choices: [{ delta: { content: string } }] }

let controller: AbortController | null = null

export async function fetchGPT(prompt: string, apiKey: string) {
  // Abort previous fetch if it exists
  if (controller) controller.abort()

  // Create a new AbortController
  controller = new AbortController()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
      response_format: { type: 'json_object' },
      stream: false
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    signal: controller.signal // Pass the abort signal to the fetch call
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Unauthorized')
    throw new Error('An error occurred while fetching the AI')
  }
  return (await response.json()) as unknown as GptResponse
}

export async function streamGPT(
  prompt: string,
  apiKey: string,
  callBack: (result: GptStreamResponse | '[DONE]') => void
) {
  // Abort previous fetch if it exists
  if (controller) controller.abort()

  // Create a new AbortController
  controller = new AbortController()

  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, apiKey }),
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal // Pass the abort signal to the fetch call
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  const parser = createParser((event) => {
    const { data } = event as { data: string }
    if (data === '[DONE]') callBack(data)
    else {
      const result = JSON.parse(data) as GptStreamResponse
      callBack(result)
    }
  })

  async function readStream() {
    if (!reader) return
    const { done, value } = await reader.read()
    if (done) return
    const dataString = decoder.decode(value, { stream: true })
    parser.feed(dataString)
    await readStream() // Recursively call readStream until done
  }

  await readStream() // Start reading the stream
}

export async function fetchGPTSpeech(input: string, apyKey: string) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    body: JSON.stringify({
      model: 'tts-1',
      input,
      voice: 'nova',
      response_format: 'opus'
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apyKey}`
    },
  })

  return response.arrayBuffer()
}

export function stopFetchGPT() {
  if (controller) controller.abort()
}
