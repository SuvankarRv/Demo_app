import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const { items } = useInventory();
  const router = useRouter();

  const totalItems = items.length;
  const lowStockItems = items.filter(i => i.quantity < 10).length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);
  const recentItems = items.slice(-5).reverse();

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
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: white;
            overflow-x: hidden;
          }

          .container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 30px;
          }

          /* Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid rgba(255, 215, 0, 0.2);
          }

          .header-title h1 {
            font-size: 48px;
            font-weight: 900;
            background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
          }

          .header-title p {
            color: #888;
            font-size: 16px;
          }

          .logout-btn {
            padding: 14px 28px;
            background: linear-gradient(135deg, rgba(255, 68, 68, 0.2), rgba(204, 0, 0, 0.3));
            border: 2px solid rgba(255, 68, 68, 0.5);
            border-radius: 12px;
            color: #ff4444;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 8px 24px rgba(255, 68, 68, 0.2);
          }

          .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(255, 68, 68, 0.4);
            background: linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(204, 0, 0, 0.4));
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }

          .stat-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 32px;
            border: 2px solid;
            position: relative;
            overflow: hidden;
            transition: all 0.3s;
          }

          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--color1), var(--color2));
          }

          .stat-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 60px var(--shadow);
          }

          .stat-card.gold {
            --color1: #ffd700;
            --color2: #ff8c00;
            --shadow: rgba(255, 215, 0, 0.3);
            border-color: rgba(255, 215, 0, 0.3);
          }

          .stat-card.red {
            --color1: #ff4444;
            --color2: #cc0000;
            --shadow: rgba(255, 68, 68, 0.3);
            border-color: rgba(255, 68, 68, 0.3);
          }

          .stat-card.green {
            --color1: #00ff88;
            --color2: #00cc66;
            --shadow: rgba(0, 255, 136, 0.3);
            border-color: rgba(0, 255, 136, 0.3);
          }

          .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .stat-label {
            font-size: 13px;
            font-weight: 700;
            color: #999;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }

          .stat-icon {
            font-size: 32px;
            opacity: 0.8;
          }

          .stat-value {
            font-size: 56px;
            font-weight: 900;
            margin-bottom: 16px;
            background: linear-gradient(135deg, var(--color1), var(--color2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .stat-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
          }

          .stat-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color1), var(--color2));
            border-radius: 4px;
            transition: width 1s ease;
          }

          /* Content Grid */
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 40px;
          }

          @media (max-width: 968px) {
            .content-grid {
              grid-template-columns: 1fr;
            }
          }

          .card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 32px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .card-header {
            display: flex;
            justify-between;
            align-items: center;
            margin-bottom: 28px;
          }

          .card-title {
            font-size: 24px;
            font-weight: 800;
            color: #ffd700;
          }

          .view-all {
            color: #00ff88;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
          }

          .view-all:hover {
            color: #00cc66;
            transform: translateX(4px);
          }

          /* Recent Items List */
          .item-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s;
          }

          .item:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateX(8px);
          }

          .item-info h3 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #fff;
          }

          .item-info p {
            font-size: 14px;
            color: #888;
          }

          .item-badge {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            border: 2px solid;
          }

          .item-badge.low {
            background: rgba(255, 68, 68, 0.15);
            border-color: rgba(255, 68, 68, 0.4);
            color: #ff4444;
          }

          .item-badge.ok {
            background: rgba(0, 255, 136, 0.15);
            border-color: rgba(0, 255, 136, 0.4);
            color: #00ff88;
          }

          .empty-state {
            text-align: center;
            padding: 60px 20px;
          }

          .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.3;
          }

          .empty-state-text {
            color: #666;
            font-size: 16px;
            margin-bottom: 8px;
          }

          .empty-state-subtext {
            color: #555;
            font-size: 14px;
          }

          /* Quick Actions */
          .actions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .action-btn {
            padding: 32px;
            border-radius: 16px;
            border: 2px solid;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: block;
          }

          .action-btn:hover {
            transform: translateY(-8px);
          }

          .action-btn.primary {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.15));
            border-color: rgba(255, 215, 0, 0.4);
            box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
          }

          .action-btn.primary:hover {
            box-shadow: 0 16px 48px rgba(255, 215, 0, 0.4);
          }

          .action-btn.secondary {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 204, 102, 0.15));
            border-color: rgba(0, 255, 136, 0.4);
            box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2);
          }

          .action-btn.secondary:hover {
            box-shadow: 0 16px 48px rgba(0, 255, 136, 0.4);
          }

          .action-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }

          .action-title {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 8px;
          }

          .action-btn.primary .action-title {
            color: #ffd700;
          }

          .action-btn.secondary .action-title {
            color: #00ff88;
          }

          .action-subtitle {
            font-size: 13px;
            color: #888;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding: 40px 0;
            color: #555;
            font-size: 12px;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="header-title">
              <h1>Dashboard</h1>
              <p>Welcome to Demo Inventory ✨</p>
            </div>
            <button class="logout-btn" id="logout-btn">🚪 Logout</button>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card gold">
              <div class="stat-header">
                <span class="stat-label">Total Items</span>
                <span class="stat-icon">📦</span>
              </div>
              <div class="stat-value">${totalItems}</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" style="width: 75%"></div>
              </div>
            </div>

            <div class="stat-card red">
              <div class="stat-header">
                <span class="stat-label">Low Stock</span>
                <span class="stat-icon">⚠️</span>
              </div>
              <div class="stat-value">${lowStockItems}</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" style="width: 40%"></div>
              </div>
            </div>

            <div class="stat-card green">
              <div class="stat-header">
                <span class="stat-label">Total Value</span>
                <span class="stat-icon">💰</span>
              </div>
              <div class="stat-value">$${totalValue.toFixed(0)}</div>
              <div class="stat-bar">
                <div class="stat-bar-fill" style="width: 90%"></div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Recent Items -->
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">📋 Recent Items</h2>
                <a href="#" class="view-all" id="view-all">View All →</a>
              </div>
              <div class="item-list" id="item-list">
                ${recentItems.length > 0 ? recentItems.map(item => `
                  <div class="item">
                    <div class="item-info">
                      <h3>${item.name}</h3>
                      <p>Quantity: ${item.quantity} units</p>
                    </div>
                    <span class="item-badge ${item.quantity < 10 ? 'low' : 'ok'}">
                      ${item.quantity < 10 ? '⚠️ Low' : '✓ OK'}
                    </span>
                  </div>
                `).join('') : `
                  <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">No items in inventory yet</div>
                    <div class="empty-state-subtext">Click "Add Item" to get started</div>
                  </div>
                `}
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">⚡ Quick Actions</h2>
              </div>
              <div class="actions-grid">
                <a href="#" class="action-btn primary" id="add-item-btn">
                  <div class="action-icon">➕</div>
                  <div class="action-title">Add Item</div>
                  <div class="action-subtitle">Create new</div>
                </a>
                <a href="#" class="action-btn secondary" id="view-inventory-btn">
                  <div class="action-icon">📊</div>
                  <div class="action-title">View All</div>
                  <div class="action-subtitle">Full list</div>
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            Made by Suvankar ✨
          </div>
        </div>

        <script>
          // Logout handler
          document.getElementById('logout-btn').addEventListener('click', function() {
            window.parent.postMessage({ type: 'LOGOUT' }, '*');
          });

          // Add Item handler
          document.getElementById('add-item-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.parent.postMessage({ type: 'ADD_ITEM' }, '*');
          });

          // View Inventory handler
          document.getElementById('view-inventory-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.parent.postMessage({ type: 'VIEW_INVENTORY' }, '*');
          });

          document.getElementById('view-all').addEventListener('click', function(e) {
            e.preventDefault();
            window.parent.postMessage({ type: 'VIEW_INVENTORY' }, '*');
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
      if (event.data.type === 'LOGOUT') {
        signOut();
      } else if (event.data.type === 'ADD_ITEM') {
        router.push('/add-item');
      } else if (event.data.type === 'VIEW_INVENTORY') {
        router.push('/inventory');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe);
      }
    };
  }, [signOut, router, items]);

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
