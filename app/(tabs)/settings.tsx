import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState('gold');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem('app_settings');
        if (settings) {
          const parsed = JSON.parse(settings);
          setDarkMode(parsed.darkMode ?? true);
          setTheme(parsed.theme ?? 'gold');
          setNotifications(parsed.notifications ?? true);
          setAutoSave(parsed.autoSave ?? true);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const settings = {
          darkMode,
          theme,
          notifications,
          autoSave
        };
        await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings', error);
      }
    };
    saveSettings();
  }, [darkMode, theme, notifications, autoSave]);

  useEffect(() => {
    if (!containerRef.current) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            width: 100%;
            min-height: 100vh;
            background: ${darkMode ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: ${darkMode ? 'white' : '#333'};
            overflow-x: hidden;
            transition: all 0.3s;
          }

          .container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 30px;
          }

          /* Header */
          .header {
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid ${darkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
          }

          .header h1 {
            font-size: 48px;
            font-weight: 900;
            background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
          }

          .header p {
            color: ${darkMode ? '#888' : '#666'};
            font-size: 16px;
          }

          /* Settings Card */
          .settings-card {
            background: ${darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 32px;
            border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            margin-bottom: 24px;
            box-shadow: 0 8px 32px ${darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
          }

          .section-title {
            font-size: 20px;
            font-weight: 800;
            color: #ffd700;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .section-title-icon {
            font-size: 24px;
          }

          /* Setting Item */
          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: ${darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'};
            border-radius: 12px;
            margin-bottom: 16px;
            transition: all 0.3s;
          }

          .setting-item:hover {
            background: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            transform: translateX(4px);
          }

          .setting-info h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 6px;
            color: ${darkMode ? '#fff' : '#333'};
          }

          .setting-info p {
            font-size: 13px;
            color: ${darkMode ? '#888' : '#666'};
          }

          /* Toggle Switch */
          .toggle {
            position: relative;
            width: 60px;
            height: 32px;
            background: ${darkMode ? '#2a2a2a' : '#ccc'};
            border-radius: 32px;
            cursor: pointer;
            transition: background 0.3s;
            border: 2px solid ${darkMode ? '#444' : '#999'};
          }

          .toggle.active {
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            border-color: #ff8c00;
          }

          .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 24px;
            height: 24px;
            background: #fff;
            border-radius: 50%;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .toggle.active .toggle-slider {
            transform: translateX(28px);
          }

          /* Theme Options */
          .theme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 16px;
            margin-top: 16px;
          }

          .theme-option {
            padding: 24px 16px;
            border-radius: 12px;
            border: 2px solid transparent;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
            position: relative;
          }

          .theme-option:hover {
            transform: translateY(-4px);
          }

          .theme-option.active {
            border-color: currentColor;
            box-shadow: 0 8px 24px currentColor;
          }

          .theme-option.active::after {
            content: '✓';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: currentColor;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 900;
            color: #000;
          }

          .theme-gold {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.3));
            color: #ffd700;
          }

          .theme-purple {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(168, 85, 247, 0.3));
            color: #a855f7;
          }

          .theme-blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.3));
            color: #3b82f6;
          }

          .theme-green {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 204, 102, 0.3));
            color: #00ff88;
          }

          .theme-name {
            font-size: 14px;
            font-weight: 700;
            margin-top: 8px;
          }

          .theme-icon {
            font-size: 32px;
            margin-bottom: 4px;
          }

          /* About Section */
          .about-info {
            text-align: center;
            padding: 32px;
            color: ${darkMode ? '#888' : '#666'};
          }

          .about-info h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #ffd700;
          }

          .about-info p {
            font-size: 14px;
            margin-bottom: 8px;
          }

          .version {
            display: inline-block;
            padding: 6px 12px;
            background: ${darkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.3)'};
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #ffd700;
            margin: 16px 0;
          }

          .credit {
            font-style: italic;
            font-size: 12px;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>⚙️ Settings</h1>
            <p>Customize your experience</p>
          </div>

          <!-- Appearance Settings -->
          <div class="settings-card">
            <div class="section-title">
              <span class="section-title-icon">🎨</span>
              Appearance
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Dark Mode</h3>
                <p>Toggle dark/light theme</p>
              </div>
              <div class="toggle ${darkMode ? 'active' : ''}" id="dark-mode-toggle">
                <div class="toggle-slider"></div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Theme Color</h3>
                <p>Choose your preferred color scheme</p>
              </div>
            </div>

            <div class="theme-grid">
              <div class="theme-option theme-gold ${theme === 'gold' ? 'active' : ''}" data-theme="gold">
                <div class="theme-icon">✨</div>
                <div class="theme-name">Gold</div>
              </div>
              <div class="theme-option theme-purple ${theme === 'purple' ? 'active' : ''}" data-theme="purple">
                <div class="theme-icon">💜</div>
                <div class="theme-name">Purple</div>
              </div>
              <div class="theme-option theme-blue ${theme === 'blue' ? 'active' : ''}" data-theme="blue">
                <div class="theme-icon">💙</div>
                <div class="theme-name">Blue</div>
              </div>
              <div class="theme-option theme-green ${theme === 'green' ? 'active' : ''}" data-theme="green">
                <div class="theme-icon">💚</div>
                <div class="theme-name">Green</div>
              </div>
            </div>
          </div>

          <!-- General Settings -->
          <div class="settings-card">
            <div class="section-title">
              <span class="section-title-icon">🔔</span>
              General
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Notifications</h3>
                <p>Enable low stock alerts</p>
              </div>
              <div class="toggle ${notifications ? 'active' : ''}" id="notifications-toggle">
                <div class="toggle-slider"></div>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Auto-Save</h3>
                <p>Automatically save changes</p>
              </div>
              <div class="toggle ${autoSave ? 'active' : ''}" id="autosave-toggle">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="settings-card">
            <div class="about-info">
              <h3>Demo Inventory</h3>
              <p>Professional inventory management system</p>
              <div class="version">v1.0.0</div>
              <p class="credit">Made by Suvankar ✨</p>
            </div>
          </div>
        </div>

        <script>
          let darkModeState = ${darkMode};
          let themeState = '${theme}';
          let notificationsState = ${notifications};
          let autoSaveState = ${autoSave};

          // Dark Mode Toggle
          document.getElementById('dark-mode-toggle').addEventListener('click', function() {
            darkModeState = !darkModeState;
            this.classList.toggle('active');
            window.parent.postMessage({ type: 'TOGGLE_DARK_MODE', value: darkModeState }, '*');
          });

          // Notifications Toggle
          document.getElementById('notifications-toggle').addEventListener('click', function() {
            notificationsState = !notificationsState;
            this.classList.toggle('active');
            window.parent.postMessage({ type: 'TOGGLE_NOTIFICATIONS', value: notificationsState }, '*');
          });

          // Auto-Save Toggle
          document.getElementById('autosave-toggle').addEventListener('click', function() {
            autoSaveState = !autoSaveState;
            this.classList.toggle('active');
            window.parent.postMessage({ type: 'TOGGLE_AUTOSAVE', value: autoSaveState }, '*');
          });

          // Theme Selection
          document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', function() {
              const selectedTheme = this.dataset.theme;
              document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
              this.classList.add('active');
              window.parent.postMessage({ type: 'CHANGE_THEME', value: selectedTheme }, '*');
            });
          });
        </script>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.srcdoc = htmlContent;

    containerRef.current.appendChild(iframe);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TOGGLE_DARK_MODE') {
        setDarkMode(event.data.value);
        console.log('Dark Mode:', event.data.value);
      } else if (event.data.type === 'CHANGE_THEME') {
        setTheme(event.data.value);
        console.log('Theme changed to:', event.data.value);
      } else if (event.data.type === 'TOGGLE_NOTIFICATIONS') {
        setNotifications(event.data.value);
        console.log('Notifications:', event.data.value);
      } else if (event.data.type === 'TOGGLE_AUTOSAVE') {
        setAutoSave(event.data.value);
        console.log('Auto-save:', event.data.value);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe);
      }
    };
  }, [darkMode, theme, notifications, autoSave]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <div ref={containerRef as any} style={{ flex: 1, width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
