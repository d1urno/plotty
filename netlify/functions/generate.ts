import cors from '../lib/cors'

export default async (req: Request) => {
  const { prompt, apiKey } = await req.json()
  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
      response_format: { type: 'json_object' },
      stream: true
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  })

  // `cors` also takes care of handling OPTIONS requests
  return cors(
    req,
    new Response(completion.body, {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })
  )
}

export const config = { path: '/api/generate', method: 'POST' }
