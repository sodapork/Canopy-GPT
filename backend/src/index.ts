import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Q&A endpoint
app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ 
        error: 'Question is required and must be a string' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    const systemPrompt = `You are a helpful assistant for Canopy's website. Canopy is a remote monitoring and management platform for connected products like kiosks, security systems, digital signage, retail POS systems, and more.

Key information about Canopy:
- Canopy helps reduce downtime and costs for connected product fleets
- It provides centralized monitoring, remote management, automation, and analytics
- Canopy works with various devices: kiosks, security systems, digital signage, retail solutions, IoT devices, and custom products
- It offers features like real-time monitoring, automated issue resolution, and comprehensive reporting
- Canopy integrates with existing systems and provides APIs for customization

When answering user questions, if a relevant article or glossary entry exists on Canopy's website, recommend it and provide a clickable link. Use these resources:
- News & Insights: https://www.gocanopy.com/news-insights
- Glossary: https://www.gocanopy.com/glossary

For example, if a user asks about remote device management, you might say: "Learn more in our [Remote Device Management Guide](https://www.gocanopy.com/news-insights)." If a user asks about a specific term, link to the glossary entry if available.

Answer user questions clearly, concisely, and accurately about Canopy's services, features, and capabilities. If you're not sure about specific details, suggest they contact Canopy's sales team or visit their website at https://www.gocanopy.com/.`;

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

    res.json({ 
      answer,
      question,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ 
      error: 'Failed to process your question. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Canopy Q&A Backend running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`❓ Q&A endpoint: http://localhost:${PORT}/ask`);
}); 