import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }
  
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not found');
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    console.log('Making OpenAI request with messages:', messages);
    
    // Enhanced system prompt for Canopy
    const systemPrompt = `You are Canopy's AI assistant, representing www.gocanopy.com. 

ABOUT CANOPY:
Canopy is a remote monitoring and management platform that helps businesses see and solve problems automatically. We specialize in monitoring and managing connected devices including:
- Kiosks and self-service terminals
- Point of Sale (POS) systems
- Security systems and cameras
- Smart lockers and vending machines
- Digital signage displays
- IoT devices and sensors

KEY FEATURES:
- Real-time device monitoring and alerts
- Remote device management and control
- Automated problem detection and resolution
- Centralized dashboard for all devices
- Custom integrations and APIs
- Detailed analytics and reporting
- 24/7 support and maintenance

INDUSTRIES WE SERVE:
- Retail and restaurants
- Healthcare and banking
- Transportation and logistics
- Education and government
- Manufacturing and warehousing

RESPONSE GUIDELINES:
1. ONLY answer questions related to Canopy, remote monitoring, device management, or our services
2. If asked about unrelated topics, politely redirect to Canopy-related questions
3. Keep responses concise, professional, and helpful
4. Use a friendly, approachable tone that matches Canopy's brand
5. Focus on how Canopy helps businesses reduce downtime, improve efficiency, and save costs
6. Encourage visitors to learn more about our platform or contact sales for demos

If someone asks about something completely unrelated to Canopy or device monitoring, respond with: "I'm Canopy's AI assistant, focused on helping businesses with remote monitoring and device management. I'd be happy to help you learn about how Canopy can improve your operations, or you can ask me about our features, pricing, or how we work with different industries."`;

    // Add the enhanced system prompt to the beginning of messages
    const enhancedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(msg => msg.role !== 'system') // Remove any existing system messages
    ];
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: enhancedMessages,
      max_tokens: 512,
      temperature: 0.7
    });
    
    const reply = completion.choices[0]?.message?.content || '';
    console.log('OpenAI response:', reply);
    
    res.status(200).json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: err.message });
  }
} 