import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }

          /* Chat Button */
          .chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
            z-index: 9999;
            transition: all 0.3s;
            border: none;
          }

          .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(255, 215, 0, 0.6);
          }

          .chat-button:active {
            transform: scale(0.95);
          }

          .chat-icon {
            font-size: 28px;
          }

          /* Chat Window */
          .chat-window {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 380px;
            height: 500px;
            background: linear-gradient(135deg, #1a1a2e, #0a0a0a);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 215, 0, 0.3);
            display: ${isOpen ? 'flex' : 'none'};
            flex-direction: column;
            z-index: 9998;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Header */
          .chat-header {
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.3));
            border-radius: 20px 20px 0 0;
            border-bottom: 1px solid rgba(255, 215, 0, 0.2);
          }

          .chat-header h3 {
            color: #ffd700;
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 4px;
          }

          .chat-header p {
            color: #888;
            font-size: 13px;
          }

          /* Messages */
          .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 12px;
            animation: fadeIn 0.3s;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .message.bot {
            background: rgba(255, 215, 0, 0.15);
            border: 1px solid rgba(255, 215, 0, 0.3);
            color: #fff;
            align-self: flex-start;
          }

          .message.user {
            background: rgba(0, 255, 136, 0.15);
            border: 1px solid rgba(0, 255, 136, 0.3);
            color: #fff;
            align-self: flex-end;
          }

          .message-sender {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 6px;
            opacity: 0.7;
          }

          .message-text {
            font-size: 14px;
            line-height: 1.5;
          }

          /* Input */
          .chat-input-container {
            padding: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.3);
            border-radius: 0 0 20px 20px;
          }

          .chat-input-wrapper {
            display: flex;
            gap: 8px;
          }

          .chat-input {
            flex: 1;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            outline: none;
          }

          .chat-input:focus {
            border-color: #ffd700;
          }

          .send-button {
            padding: 12px 20px;
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            border: none;
            border-radius: 12px;
            color: #000;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
          }

          .send-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
          }

          .send-button:active {
            transform: translateY(0);
          }

          .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 8px;
          }

          .typing-dot {
            width: 8px;
            height: 8px;
            background: #ffd700;
            border-radius: 50%;
            animation: typing 1.4s infinite;
          }

          .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes typing {
            0%, 60%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            30% {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
      </head>
      <body>
        <button class="chat-button" id="chat-toggle">
          <span class="chat-icon">💬</span>
        </button>

        <div class="chat-window" id="chat-window">
          <div class="chat-header">
            <h3>🤖 AI Support</h3>
            <p>How can I help you today?</p>
          </div>

          <div class="chat-messages" id="messages">
            <div class="message bot">
              <div class="message-sender">AI Assistant</div>
              <div class="message-text">
                Hi! 👋 I'm your AI assistant. I can help you with:
                <br><br>
                • Managing inventory
                <br>• Adding new items
                <br>• Understanding features
                <br>• General questions
                <br><br>
                How can I assist you?
              </div>
            </div>
          </div>

          <div class="chat-input-container">
            <div class="chat-input-wrapper">
              <input type="text" class="chat-input" id="chat-input" placeholder="Type your message...">
              <button class="send-button" id="send-button">Send</button>
            </div>
          </div>
        </div>

        <script>
          const chatToggle = document.getElementById('chat-toggle');
          const chatWindow = document.getElementById('chat-window');
          const chatInput = document.getElementById('chat-input');
          const sendButton = document.getElementById('send-button');
          const messages = document.getElementById('messages');
          let isOpen = ${isOpen};

          chatToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            chatWindow.style.display = isOpen ? 'flex' : 'none';
            window.parent.postMessage({ type: 'CHAT_TOGGLE', value: isOpen }, '*');
          });

          function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}\`;
            messageDiv.innerHTML = \`
              <div class="message-sender">\${sender === 'bot' ? 'AI Assistant' : 'You'}</div>
              <div class="message-text">\${text}</div>
            \`;
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
          }

          function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.id = 'typing';
            typingDiv.innerHTML = \`
              <div class="message-sender">AI Assistant</div>
              <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
            \`;
            messages.appendChild(typingDiv);
            messages.scrollTop = messages.scrollHeight;
          }

          function hideTyping() {
            const typing = document.getElementById('typing');
            if (typing) typing.remove();
          }

          function getBotResponse(userMessage) {
            const lowerMsg = userMessage.toLowerCase();
            
            // Get inventory data from parent
            window.parent.postMessage({ type: 'GET_INVENTORY_DATA' }, '*');
            
            // Basic conversation
            if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
              return "Hello! 👋 I'm your AI inventory analyst. I can help you analyze stock levels, calculate profit/loss, and provide intelligent insights. Try asking me to 'analyze inventory' or 'show profit and loss'!";
            }
            
            if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
              return "🤖 I can help you with:<br><br>" +
                "• Inventory analysis and insights<br>" +
                "• Profit & loss calculations<br>" +
                "• Low stock alerts<br>" +
                "• Inventory health scoring<br>" +
                "• Top performing items<br>" +
                "• Category breakdowns<br>" +
                "• Total value calculations<br><br>" +
                "Just ask me anything about your inventory!";
            }
            
            if (lowerMsg.includes('thanks') || lowerMsg.includes('thank')) {
              return "You're welcome! Feel free to ask if you need more insights! 😊";
            }
            
            // Inventory Analytics
            if (lowerMsg.includes('analyze') || lowerMsg.includes('overview') || lowerMsg.includes('summary')) {
              return "📊 <strong>Inventory Analysis</strong><br><br>" +
                "📦 Total Items: <strong>[ITEMS_COUNT]</strong><br>" +
                "🔢 Total Quantity: <strong>[TOTAL_QTY] units</strong><br>" +
                "💰 Total Value: <strong>$[TOTAL_VALUE]</strong><br>" +
                "📈 Average Value: <strong>$[AVG_VALUE]</strong><br>" +
                "⚠️ Low Stock Items: <strong>[LOW_STOCK_COUNT]</strong><br>" +
                "🏆 Top Category: <strong>[TOP_CATEGORY]</strong><br><br>" +
                "[ACTION_MESSAGE]";
            }
            
            // Profit & Loss
            if (lowerMsg.includes('profit') || lowerMsg.includes('loss') || lowerMsg.includes('p&l') || lowerMsg.includes('margin')) {
              return "💼 <strong>Profit & Loss Analysis</strong><br><br>" +
                "📈 Total Revenue (Stock Value): <strong>$[TOTAL_VALUE]</strong><br>" +
                "📉 Estimated Cost (70%): <strong>$[EST_COST]</strong><br>" +
                "💚 Profit/Loss: <strong>$[PROFIT]</strong><br>" +
                "📊 Profit Margin: <strong>[MARGIN]%</strong><br>" +
                "⚠️ Potential Loss (Low Stock): <strong>$[POTENTIAL_LOSS]</strong><br><br>" +
                "[PROFIT_MESSAGE]";
            }
            
            // Low Stock
            if (lowerMsg.includes('low stock') || lowerMsg.includes('alert') || lowerMsg.includes('running out')) {
              return "⚠️ <strong>Low Stock Alert</strong><br><br>" +
                "Found <strong>[LOW_STOCK_COUNT]</strong> item(s) with low inventory:<br><br>" +
                "[LOW_STOCK_LIST]<br>" +
                "💡 Tip: Restock items below 5 units urgently!";
            }
            
            // Health Score
            if (lowerMsg.includes('health') || lowerMsg.includes('score') || lowerMsg.includes('status')) {
              return "🏥 <strong>Inventory Health Score: [HEALTH_SCORE]/100</strong><br><br>" +
                "✅ Healthy Items: <strong>[HEALTHY_COUNT]</strong><br>" +
                "⚠️ Low Stock: <strong>[LOW_STOCK_COUNT]</strong><br>" +
                "🚨 Critical: <strong>[CRITICAL_COUNT]</strong><br><br>" +
                "[HEALTH_MESSAGE]<br><br>" +
                "💡 Recommendation: Maintain at least 10 units per item for optimal stock levels.";
            }
            
            // Top Items
            if (lowerMsg.includes('top') || lowerMsg.includes('best') || lowerMsg.includes('valuable')) {
              return "🏆 <strong>Top 5 Most Valuable Items</strong><br><br>[TOP_ITEMS_LIST]";
            }
            
            // Category Breakdown
            if (lowerMsg.includes('category') || lowerMsg.includes('categories') || lowerMsg.includes('breakdown')) {
              return "📊 <strong>Category Breakdown</strong><br><br>[CATEGORY_LIST]";
            }
            
            // Total Value
            if (lowerMsg.includes('total') && lowerMsg.includes('value')) {
              return "💰 <strong>Total Inventory Value</strong><br><br>" +
                "<strong style='font-size: 24px; color: #ffd700;'>$[TOTAL_VALUE]</strong><br><br>" +
                "This represents the current value of all <strong>[ITEMS_COUNT]</strong> items in stock.";
            }
            
            // Count
            if (lowerMsg.includes('how many') || lowerMsg.includes('count')) {
              return "📦 You currently have <strong>[ITEMS_COUNT] unique items</strong> in your inventory, totaling <strong>[TOTAL_QTY] units</strong>.";
            }
            
            // Navigation help
            if (lowerMsg.includes('add') && lowerMsg.includes('item')) {
              return "To add an item, click the 'Add Item' button on the dashboard or navigate to the Inventory tab and click the '+' icon. Fill in the item details and save! 📦";
            }
            
            if (lowerMsg.includes('delete') || lowerMsg.includes('remove')) {
              return "To delete an item, go to the Inventory tab, find the item you want to remove, and click the delete button (trash icon) next to it. You'll get a confirmation before deletion! 🗑️";
            }
            
            if (lowerMsg.includes('search') || lowerMsg.includes('find')) {
              return "You can search for items using the search bar at the top of the Inventory page. Just type the item name, SKU, or category! 🔍";
            }
            
            if (lowerMsg.includes('dark') || lowerMsg.includes('theme')) {
              return "You can change the theme in Settings! Go to the Settings tab ⚙️ and toggle Dark Mode or choose from different color themes (Gold, Purple, Blue, Green). ✨";
            }
            
            // Default
            return "I understand you're asking about: '" + userMessage + "'. <br><br>" +
              "For AI-powered insights, try:<br>" +
              "• 'Analyze my inventory'<br>" +
              "• 'Show profit and loss'<br>" +
              "• 'What's my inventory health?'<br>" +
              "• 'Show top items'<br><br>" +
              "Type 'help' for all available commands! 💡";
          }

          function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            showTyping();
            setTimeout(() => {
              hideTyping();
              const response = getBotResponse(text);
              addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
          }

          sendButton.addEventListener('click', sendMessage);
          chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
          });
        </script>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '9999';
    iframe.srcdoc = htmlContent;

    // Allow pointer events only for iframe content
    iframe.onload = () => {
      iframe.style.pointerEvents = 'auto';
    };

    containerRef.current.appendChild(iframe);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CHAT_TOGGLE') {
        setIsOpen(event.data.value);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe);
      }
    };
  }, [isOpen]);

  return (
    <View style={styles.container}>
      <div ref={containerRef as any} style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
