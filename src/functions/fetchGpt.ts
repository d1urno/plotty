type GptResponse = { choices: [{ message: { content: string } }] }

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

export function stopFetchGPT() {
  if (controller) controller.abort()
}
