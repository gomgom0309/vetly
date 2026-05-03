export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { message } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `당신은 Vetly의 AI 강아지 건강 상담사입니다. 한국어로 친절하게 답변하세요. 답변 맨 앞에 반드시 [EMERGENCY], [WATCH], [OK] 중 하나로 응급 여부를 표시하세요. 마지막에 항상 "이 정보는 AI 분석이며, 수의사의 진료를 대체하지 않습니다."를 추가하세요.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const text = await response.text();
    console.log('API response:', text);
    
    const data = JSON.parse(text);
    
    if (data.error) {
      console.log('API error:', data.error);
      return res.status(500).json({ reply: data.error.message || '죄송해요, 잠시 후 다시 시도해주세요.' });
    }

    const reply = data.content && data.content[0] ? data.content[0].text : '죄송해요, 잠시 후 다시 시도해주세요.';
    res.status(200).json({ reply });

  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ reply: '죄송해요, 잠시 후 다시 시도해주세요.' });
  }
}
