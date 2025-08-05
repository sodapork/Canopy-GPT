(function() {
  'use strict';

  // Configuration
  const config = {
    apiUrl: 'https://canopy-gpt-front-end-git-master-jp-pophams-projects.vercel.app/api/chat',
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    primaryColor: '#1a73e8',
    title: 'Canopy Assistant'
  };

  // Check if widget already exists to prevent duplicates
  if (document.getElementById('canopy-widget')) {
    console.log('Canopy widget already exists, skipping initialization');
    return;
  }

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
      <div id="canopy-widget" style="
        position: fixed;
        ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <!-- Chat Window -->
        <div id="canopy-chat-window" style="
          display: none;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid #e1e5e9;
          flex-direction: column;
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
            <button id="canopy-close" style="
              background: none;
              border: none;
              color: white;
              font-size: 20px;
              cursor: pointer;
              padding: 0;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">×</button>
          </div>
          
          <!-- Messages -->
          <div id="canopy-messages" style="
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
            <form id="canopy-form" style="display: flex; gap: 8;">
              <input id="canopy-input" type="text" placeholder="Ask me anything..." style="
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
        
        <!-- Toggle Button -->
        <button id="canopy-toggle" style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${config.primaryColor};
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        ">💬</button>
      </div>
    `;
    
    try {
      document.body.insertAdjacentHTML('beforeend', widgetHTML);
      console.log('Canopy widget created successfully');
    } catch (error) {
      console.error('Error creating Canopy widget:', error);
    }
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    try {
      const messagesContainer = document.getElementById('canopy-messages');
      if (!messagesContainer) {
        console.error('Messages container not found');
        return;
      }
      
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
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  // Send message to API
  async function sendMessage(message) {
    try {
      console.log('Sending message to API:', config.apiUrl);
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response received:', data);
      return data.reply || 'Sorry, I didn\'t get a proper response. Please try again.';
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
    }
  }

  // Initialize widget
  function init() {
    try {
      console.log('Initializing Canopy widget...');
      createWidget();
      
      const toggle = document.getElementById('canopy-toggle');
      const chatWindow = document.getElementById('canopy-chat-window');
      const closeBtn = document.getElementById('canopy-close');
      const form = document.getElementById('canopy-form');
      const input = document.getElementById('canopy-input');
      
      if (!toggle || !chatWindow || !closeBtn || !form || !input) {
        console.error('Some widget elements not found');
        return;
      }
      
      // Toggle chat window
      toggle.addEventListener('click', () => {
        const isVisible = chatWindow.style.display === 'flex';
        chatWindow.style.display = isVisible ? 'none' : 'flex';
        toggle.style.transform = isVisible ? 'none' : 'scale(0.9)';
        if (!isVisible) {
          input.focus();
        }
      });
      
      // Close chat window
      closeBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        toggle.style.transform = 'none';
      });
      
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
        document.getElementById('canopy-messages').appendChild(loadingDiv);
        
        // Get response
        const response = await sendMessage(message);
        
        // Remove loading and add response
        loadingDiv.remove();
        addMessage(response, false);
      });
      
      console.log('Canopy widget initialized successfully!');
    } catch (error) {
      console.error('Error initializing Canopy widget:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure DOM is fully ready
    setTimeout(init, 100);
  }
})(); 