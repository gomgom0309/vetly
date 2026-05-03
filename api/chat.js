export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `당신은 Vetly의 AI 강아지 건강 상담사입니다. 수의학 지식을 바탕으로 반려견 보호자들의 질문에 답합니다. 한국어로 친절하고 따뜻하게 답변하세요. 답변 맨 앞에 반드시 [EMERGENCY], [WATCH], [OK] 중 하나로 응급 여부를 표시하세요. 마지막에 항상 "이 정보는 AI 분석이며, 수의사의 진료를 대체하지 않습니다."를 추가하세요.`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.content[0].text });
}
