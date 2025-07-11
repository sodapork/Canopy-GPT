# Canopy Chatbot Widget

This project provides a floating chatbot widget that can be embedded on any website, powered by OpenAI. It also includes an API endpoint for handling chat requests.

## Features
- **Embeddable Widget:** Add a floating chat assistant to any website with a single script tag.
- **OpenAI Integration:** Uses OpenAI's API to generate responses.
- **No Frameworks:** No Next.js or React dependencies—just a static widget and API.

## Usage

### 1. Deploy
- Deploy this repository to Vercel or your preferred Node.js hosting.
- Set the `OPENAI_API_KEY` environment variable in your deployment settings.

### 2. Embed the Widget
Add this script tag to your website (replace the domain with your deployment):

```html
<script src="https://your-vercel-domain.vercel.app/widget.js"></script>
```

This will display a floating chat button in the bottom right corner of your site.

### 3. API Endpoint
The widget communicates with the API endpoint at:

```
/api/chat
```

This endpoint expects a POST request with a `messages` array (OpenAI chat format) and returns the assistant's reply.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your OpenAI API key to a `.env` file:
   ```bash
   echo "OPENAI_API_KEY=sk-..." > .env
   ```
3. Start the server (if using a local Node.js server):
   ```bash
   # You may need to use a simple server or framework to serve the API and public files
   # Example: npx serve public
   ```

## Customization
- Edit `public/widget.js` to change the widget's appearance, position, or system prompt.
- The API logic is in `pages/api/chat.js`.

## License
MIT 