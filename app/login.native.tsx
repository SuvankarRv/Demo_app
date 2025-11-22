import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

export default function NativeLogin({ signIn }: { signIn: (email: string) => void }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .spotlight {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            transparent 100px, 
            rgba(0, 0, 0, 0.98) 250px
          );
          z-index: 10;
          pointer-events: none;
          transition: background 0.1s ease;
        }

        body.light-on .spotlight {
          background: radial-gradient(
            circle at 50% 10%, 
            transparent 150vh, 
            rgba(0, 0, 0, 0) 200vh
          );
          transition: background 0.8s ease-in-out;
        }

        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to bottom, #111827, #1F2937);
        }

        .lamp-container {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: swing 3s ease-in-out infinite alternate;
          transform-origin: top center;
          cursor: pointer;
        }

        .cord {
          width: 4px;
          height: 150px;
          background: #333;
        }

        .shade {
          width: 120px;
          height: 60px;
          background: linear-gradient(to bottom, #333, #555);
          border-radius: 60px 60px 0 0;
          position: relative;
          display: flex;
          justify-content: center;
          border: 2px solid #222;
        }
        
        .bulb {
          width: 50px;
          height: 50px;
          background: #333;
          border-radius: 50%;
          position: absolute;
          bottom: -25px;
          transition: all 0.3s;
          border: 2px solid #222;
        }
        
        body.light-on .bulb {
          background: #FBBF24;
          border-color: #F59E0B;
          box-shadow: 
            0 0 30px #FBBF24,
            0 0 60px #FBBF24,
            0 0 90px #F59E0B,
            0 0 120px #F59E0B,
            inset 0 0 20px #FCD34D;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            box-shadow: 
              0 0 30px #FBBF24,
              0 0 60px #FBBF24,
              0 0 90px #F59E0B,
              0 0 120px #F59E0B,
              inset 0 0 20px #FCD34D;
            transform: scale(1);
          }
          50% { 
            box-shadow: 
              0 0 40px #FBBF24,
              0 0 80px #FBBF24,
              0 0 120px #F59E0B,
              0 0 160px #F59E0B,
              inset 0 0 30px #FFF;
            transform: scale(1.05);
          }
        }

        @keyframes swing {
          from { transform: translateX(-50%) rotate(-3deg); }
          to { transform: translateX(-50%) rotate(3deg); }
        }

        .login-form {
          background: rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 80%;
          max-width: 350px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease;
          z-index: 5;
        }

        body.light-on .login-form {
          opacity: 1;
          transform: translateY(0);
        }

        h1 {
          color: white;
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
        }
        
        h1 span { color: #F59E0B; }

        .input-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          color: #ccc;
          margin-bottom: 8px;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #444;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          box-sizing: border-box;
        }
        
        input:focus {
          outline: none;
          border-color: #F59E0B;
        }

        button {
          width: 100%;
          padding: 15px;
          background: #F59E0B;
          border: none;
          border-radius: 10px;
          color: black;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          margin-top: 10px;
          transition: transform 0.1s;
        }

        button:active {
          transform: scale(0.98);
        }
        
        .hint {
          position: absolute;
          bottom: 50px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.5s;
        }
        
        body.light-on .hint {
          opacity: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="lamp-container" id="lamp">
          <div class="cord"></div>
          <div class="shade">
            <div class="bulb"></div>
          </div>
        </div>

        <div class="login-form">
          <h1>Inventory<span>Pro</span></h1>
          <div class="input-group">
            <label>Email</label>
            <input type="email" id="email" placeholder="admin@example.com" value="admin@example.com">
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="••••••••" value="password">
          </div>
          <button id="loginBtn">Sign In</button>
        </div>
        
        <div class="hint">Move to search • Tap lamp to start</div>
      </div>

      <div class="spotlight" id="spotlight"></div>

      <script>
        const body = document.body;
        const lamp = document.getElementById('lamp');
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');

        document.addEventListener('mousemove', (e) => {
          const x = e.clientX + 'px';
          const y = e.clientY + 'px';
          document.documentElement.style.setProperty('--mouse-x', x);
          document.documentElement.style.setProperty('--mouse-y', y);
        });
        
        document.addEventListener('touchmove', (e) => {
          const touch = e.touches[0];
          const x = touch.clientX + 'px';
          const y = touch.clientY + 'px';
          document.documentElement.style.setProperty('--mouse-x', x);
          document.documentElement.style.setProperty('--mouse-y', y);
        }, { passive: false });

        lamp.addEventListener('click', () => {
          console.log('Lamp clicked! Light is now:', !body.classList.contains('light-on'));
          body.classList.toggle('light-on');
        });

        loginBtn.addEventListener('click', () => {
          const email = emailInput.value;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGIN', email: email }));
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'LOGIN') {
        signIn(data.email);
      }
    } catch (e) {
      console.error("Failed to parse message from WebView", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
