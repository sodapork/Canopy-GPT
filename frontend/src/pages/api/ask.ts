import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required and must be a string' });
  }

  try {
    const systemPrompt = `You are a helpful assistant for Canopy's website. Canopy is a remote monitoring and management platform for connected products like kiosks, security systems, digital signage, retail POS systems, and more.\n\nKey information about Canopy:\n- Canopy helps reduce downtime and costs for connected product fleets\n- It provides centralized monitoring, remote management, automation, and analytics\n- Canopy works with various devices: kiosks, security systems, digital signage, retail solutions, IoT devices, and custom products\n- It offers features like real-time monitoring, automated issue resolution, and comprehensive reporting\n- Canopy integrates with existing systems and provides APIs for customization\n\nAnswer user questions clearly, concisely, and accurately about Canopy's services, features, and capabilities. If you're not sure about specific details, suggest they contact Canopy's sales team or visit their website at https://www.gocanopy.com/.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.status(200).json({
      answer,
      question,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process your question. Please try again.' });
  }
} 