const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userData } = JSON.parse(event.body);
    
    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: `You are Regology's AI sales assistant. Create a complete HTML regulatory compliance guide that demonstrates HOW REGOLOGY'S SPECIFIC PLATFORM AND AI AGENTS solve their problems.

REGOLOGY BACKGROUND:
- Global regulatory compliance platform powered by agentic AI
- Smart Law Library™ covering 50 US states + 135 countries  
- 3 AI Agents: Regulatory Change Agent, Compliance Agent, Research Agent + Reggi Copilot
- Proven results: 60% alert reduction, 50% faster cycles, 40% fewer exceptions
- Pricing: Silver $75K, Gold $150K, Platinum $450K
- 4-6 week deployment, SOC 2 compliant

CREATE A COMPLETE HTML GUIDE WITH:
- Regology purple (#481595) background, white text, Inter font
- Professional layout with sections, cards, grids  
- Their company name throughout
- Quote their exact pain points
- Industry-specific regulations
- Realistic ROI calculations based on company size
- How each AI agent solves their problems
- Call-to-action for demo/trial

Make it feel like it was created specifically for their company by someone who deeply understands their business.`,
        messages: [
          {
            role: 'user',
            content: `Create a complete personalized HTML regulatory compliance guide for:

Name: ${userData.name || 'N/A'}
Company: ${userData.company || 'N/A'}  
Role: ${userData.role || 'N/A'}
Frustration: ${userData.frustration || 'N/A'}
Challenges: ${userData.challenges || 'N/A'}

Research their company and industry, then create a detailed HTML guide showing how Regology's AI agents solve their specific problems.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ guide: data.content[0].text })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to generate guide' })
    };
  }
};
