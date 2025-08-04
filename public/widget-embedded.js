(function() {
  'use strict';

  // Configuration
  const config = {
    apiUrl: 'https://canopy-gpt-front-end-git-master-jp-pophams-projects.vercel.app/api/chat',
    primaryColor: '#1a73e8',
    title: 'Canopy Assistant'
  };

  // Create embedded widget HTML
  function createEmbeddedWidget() {
    const widgetHTML = `
      <div id="canopy-embedded-widget" style="
        width: 100%;
        height: 500px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        border: 1px solid #e1e5e9;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="
          background: ${config.primaryColor};
          color: white;
          padding: 16px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span>${config.title}</span>
          <div style="
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">💬</div>
        </div>
        
        <!-- Messages -->
        <div id="canopy-embedded-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f8f9fa;
        "></div>
        
        <!-- Input -->
        <div style="
          padding: 16px;
          background: white;
          border-top: 1px solid #e1e5e9;
        ">
          <form id="canopy-embedded-form" style="display: flex; gap: 8;">
            <input id="canopy-embedded-input" type="text" placeholder="Ask me anything about Canopy..." style="
              flex: 1;
              padding: 12px 16px;
              border: 1px solid #e1e5e9;
              border-radius: 24px;
              font-size: 14px;
              outline: none;
              background: #f8f9fa;
            ">
            <button type="submit" style="
              background: ${config.primaryColor};
              color: white;
              border: none;
              border-radius: 24px;
              padding: 12px 20px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              min-width: 60px;
            ">Send</button>
          </form>
        </div>
      </div>
    `;
    
    // Try multiple approaches to find the container
    let container = null;
    
    // Method 1: Look for the script tag and use its parent
    const scriptElement = document.currentScript || document.querySelector('script[src*="widget-embedded.js"]');
    if (scriptElement && scriptElement.parentElement) {
      container = scriptElement.parentElement;
    }
    
    // Method 2: Look for common Webflow embed containers
    if (!container) {
      container = document.querySelector('[data-wf-embed]') || 
                 document.querySelector('.w-embed') ||
                 document.querySelector('[class*="embed"]');
    }
    
    // Method 3: Create a new div if we can't find a container
    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
    }
    
    // Insert the widget
    if (container) {
      container.innerHTML = widgetHTML;
      console.log('Canopy widget embedded successfully');
    } else {
      console.error('Could not find container for Canopy widget');
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('canopy-embedded-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      display: flex;
      justify-content: ${isUser ? 'flex-end' : 'flex-start'};
      margin-bottom: 12px;
    `;
    
    const messageBubble = document.createElement('div');
    messageBubble.style.cssText = `
      background: ${isUser ? config.primaryColor : 'white'};
      color: ${isUser ? 'white' : '#333'};
      border-radius: 18px;
      padding: 12px 16px;
      max-width: 80%;
      font-size: 14px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      border: ${!isUser ? '1px solid #e1e5e9' : 'none'};
    `;
    messageBubble.textContent = content;
    
    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message to API
  async function sendMessage(message) {
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Canopy, a helpful assistant for www.gocanopy.com. Answer in a friendly, professional tone that matches Canopy\'s brand.' },
            { role: 'user', content: message }
          ]
        })
      });
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
    }
  }

  // Initialize embedded widget
  function init() {
    console.log('Initializing Canopy widget...');
    createEmbeddedWidget();
    
    // Wait a bit for the DOM to be ready
    setTimeout(() => {
      const form = document.getElementById('canopy-embedded-form');
      const input = document.getElementById('canopy-embedded-input');
      
      if (!form || !input) {
        console.error('Could not find form or input elements');
        return;
      }
      
      console.log('Setting up form handlers...');
      
      // Handle form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        input.value = '';
        
        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
          display: flex;
          justify-content: flex-start;
          margin-bottom: 12px;
        `;
        const loadingBubble = document.createElement('div');
        loadingBubble.style.cssText = `
          background: white;
          color: #666;
          border-radius: 18px;
          padding: 12px 16px;
          font-size: 14px;
          border: 1px solid #e1e5e9;
        `;
        loadingBubble.textContent = 'Canopy is typing...';
        loadingDiv.appendChild(loadingBubble);
        document.getElementById('canopy-embedded-messages').appendChild(loadingDiv);
        
        // Get response
        const response = await sendMessage(message);
        
        // Remove loading and add response
        loadingDiv.remove();
        addMessage(response, false);
      });
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 