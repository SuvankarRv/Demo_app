import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function WebLogin() {
  const { signIn } = useAuth();
  const [lightsOn, setLightsOn] = useState(false);
  const [error, setError] = useState('');
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        const x = (e.clientX / window.innerWidth) * 100 + '%';
        const y = (e.clientY / window.innerHeight) * 100 + '%';
        spotlightRef.current.style.setProperty('--x', x);
        spotlightRef.current.style.setProperty('--y', y);
      }

      // Check if credentials are wrong and move button away from cursor
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const button = document.getElementById('signin-button');

      if (emailInput && passwordInput && button) {
        const isValid = validateCredentials(emailInput.value, passwordInput.value);

        if (!isValid) {
          const buttonRect = button.getBoundingClientRect();
          const buttonCenterX = buttonRect.left + buttonRect.width / 2;
          const buttonCenterY = buttonRect.top + buttonRect.height / 2;

          // Calculate distance from cursor to button center
          const distanceX = e.clientX - buttonCenterX;
          const distanceY = e.clientY - buttonCenterY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          // If cursor is within 200px of button, make it run away!
          if (distance < 200) {
            // Calculate direction away from cursor
            const angle = Math.atan2(distanceY, distanceX);
            const escapeDistance = 300; // How far it runs

            // Move button in opposite direction
            const newX = -Math.cos(angle) * escapeDistance;
            const newY = -Math.sin(angle) * escapeDistance;

            setButtonPos({ x: newX, y: newY });
          }
        } else {
          // Reset when credentials are correct
          setButtonPos({ x: 0, y: 0 });
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleLights = () => {
    console.log('Toggling lights from', lightsOn, 'to', !lightsOn);
    setLightsOn(!lightsOn);
  };

  const validateCredentials = (email: string, password: string): boolean => {
    // Demo credentials for testing
    const validEmail = 'demo@demo.com';
    const validPassword = 'demo123';

    return email === validEmail && password === validPassword;
  };

  const handleLogin = async () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (emailInput && passwordInput) {
      const isValid = validateCredentials(emailInput.value, passwordInput.value);

      if (isValid) {
        setError('');
        setButtonPos({ x: 0, y: 0 }); // Reset button position
        await signIn(emailInput.value);
      } else {
        setError('Invalid email or password. Please try again.');
        // Shake effect
        setButtonPos({ x: 10, y: 0 });
        setTimeout(() => setButtonPos({ x: -10, y: 0 }), 100);
        setTimeout(() => setButtonPos({ x: 10, y: 0 }), 200);
        setTimeout(() => setButtonPos({ x: 0, y: 0 }), 300);
      }
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = prompt('Enter your email address to reset your password:');
    if (email) {
      // Simulate sending reset email
      setError('');
      alert(`✅ Password reset link has been sent to:\n${email}\n\nPlease check your email inbox.`);
    }
  };

  const handleCreateAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = prompt('Enter your email to create a new account:');
    if (email) {
      const password = prompt('Create a password (min 8 characters):');
      if (password && password.length >= 8) {
        setError('');
        alert(`✅ Account created successfully!\n\nEmail: ${email}\nYou can now sign in with your credentials.`);
      } else if (password) {
        alert('❌ Password must be at least 8 characters long.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <style dangerouslySetInnerHTML={{
        __html: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html, #root {
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          transition: background 0.8s;
        }

        body.lights-on, html.lights-on, #root.lights-on {
          background: linear-gradient(to bottom, #1a1a2e, #16213e);
        }

        .switch-container {
          position: absolute;
          top: 50px;
          right: 50px;
          z-index: 100;
        }

        .switch-plate {
          background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
          padding: 15px 12px;
          border-radius: 8px;
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid #0a0a0a;
        }

        .switch {
          width: 50px;
          height: 80px;
          background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
          border-radius: 4px;
          position: relative;
          cursor: pointer;
          border: 2px solid #0a0a0a;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .switch-rocker {
          position: absolute;
          width: 100%;
          height: 50%;
          background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%);
          transition: all 0.2s ease;
          border-radius: 3px;
          pointer-events: none;
        }

        .switch-rocker.top {
          top: 0;
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .switch-rocker.bottom {
          bottom: 0;
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.1);
        }

        .switch-rocker.top.off {
          background: linear-gradient(180deg, #ff4444 0%, #cc0000 100%);
          box-shadow: 
            inset 0 3px 6px rgba(0,0,0,0.5),
            0 0 15px rgba(255, 68, 68, 0.8),
            0 0 25px rgba(255, 0, 0, 0.6);
        }

        .switch-rocker.bottom.on {
          background: linear-gradient(180deg, #ffd700 0%, #ff8c00 100%);
          box-shadow: 
            inset 0 3px 6px rgba(0,0,0,0.3),
            0 0 15px rgba(255,215,0,0.6);
        }

        .switch-label {
          position: absolute;
          font-size: 10px;
          font-weight: 700;
          color: #666;
          left: 50%;
          transform: translateX(-50%);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          pointer-events: none;
        }

        .switch-label.off {
          top: 15px;
        }

        .switch-label.on {
          bottom: 15px;
        }

        .switch-label.off.active {
          color: #1a1a1a;
          text-shadow: 0 0 8px rgba(255,100,100,0.5);
        }

        .switch-label.on.active {
          color: #1a1a1a;
          text-shadow: 0 0 8px rgba(255,255,255,0.5);
        }

        .ambient-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: transparent;
          opacity: 0;
          transition: opacity 1s ease;
          pointer-events: none;
        }

        .ambient-glow.active {
          opacity: 1;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 215, 0, 0.15) 0%,
            rgba(255, 140, 0, 0.1) 30%,
            rgba(255, 102, 0, 0.05) 60%,
            transparent 100%
          );
          animation: ambient-pulse 4s ease-in-out infinite;
        }

        @keyframes ambient-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .spotlight {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            transparent 80px,
            rgba(0, 0, 0, 0.95) 200px
          );
          pointer-events: none;
          transition: opacity 0.8s;
          opacity: 1;
        }

        .spotlight.hidden {
          opacity: 0;
        }

        .content {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 90%;
          max-width: 400px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
          z-index: 10;
        }

        .login-form.visible {
          opacity: 1;
          transform: translateY(0);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 
            0 0 40px rgba(255, 215, 0, 0.3),
            0 0 80px rgba(255, 140, 0, 0.2),
            0 10px 40px rgba(0, 0, 0, 0.3);
        }

        h1 {
          color: white;
          text-align: center;
          margin-bottom: 30px;
          font-size: 32px;
          font-weight: 700;
        }

        h1 span {
          color: #ffd700;
        }

        .input-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          color: #ccc;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #ffd700;
        }

        input::placeholder {
          color: #666;
        }

        button {
          width: 60%;
          padding: 10px;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          border: none;
          border-radius: 10px;
          color: #1a1a1a;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          margin: 10px auto 0;
          transition: transform 0.1s, box-shadow 0.2s;
          position: relative;
          display: block;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
        }

        button:active {
          transform: translateY(0);
        }

        .error-message {
          color: #ff4444;
          font-size: 14px;
          margin-top: 10px;
          padding: 10px;
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid rgba(255, 68, 68, 0.3);
          border-radius: 8px;
          text-align: center;
          animation: shake 0.3s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .auth-links {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .auth-link {
          color: #999;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.3s;
          cursor: pointer;
        }

        .auth-link:hover {
          color: #ffd700;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          margin: 20px 0;
        }

        .create-account {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .create-account a {
          color: #ffd700;
          text-decoration: none;
          font-weight: 600;
          margin-left: 5px;
          transition: color 0.3s;
        }

        .create-account a:hover {
          color: #ff8c00;
        }

        .hint {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          color: #555;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 1;
          transition: opacity 0.5s;
          pointer-events: none;
          text-align: center;
        }

        .hint.hidden {
          opacity: 0;
        }
      `}} />
      <div className="switch-container">
        <div className="switch-plate">
          <div className="switch" onClick={toggleLights}>
            <div className={`switch-rocker top ${!lightsOn ? 'off' : ''}`}></div>
            <span className={`switch-label off ${!lightsOn ? 'active' : ''}`}>OFF</span>
            <span className={`switch-label on ${lightsOn ? 'active' : ''}`}>ON</span>
            <div className={`switch-rocker bottom ${lightsOn ? 'on' : ''}`}></div>
          </div>
        </div>
      </div>

      <div className={`ambient-glow ${lightsOn ? 'active' : ''}`}></div>
      <div ref={spotlightRef as any} className={`spotlight ${lightsOn ? 'hidden' : ''}`}></div>

      <div className="content">
        <div className={`login-form ${lightsOn ? 'visible' : ''}`}>
          <h1>Demo<span>Login</span></h1>
          <div className="input-group">
            <label>Email</label>
            <input type="email" id="email" placeholder="demo@demo.com" defaultValue="demo@demo.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="demo123" defaultValue="demo123" />
          </div>
          <button
            id="signin-button"
            onClick={handleLogin}
            style={{ transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)` }}
          >
            Sign In
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-links">
            <a href="#" className="auth-link" onClick={handleForgotPassword}>Forgot Password?</a>
          </div>

          <div className="divider"></div>

          <div className="create-account">
            Don&apos;t have an account?<a href="#" onClick={handleCreateAccount}>Create Account</a>
          </div>

          <div style={{
            textAlign: 'center',
            color: '#555',
            fontSize: '11px',
            marginTop: '20px',
            fontStyle: 'italic'
          }}>
            Made by Suvankar
          </div>
        </div>

        <div className={`hint ${lightsOn ? 'hidden' : ''}`}>Toggle the switch to illuminate</div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
