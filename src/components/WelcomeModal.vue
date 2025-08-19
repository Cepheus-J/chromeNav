<template>
  <div class="welcome-overlay" @click="handleClose">
    <div class="welcome-content" @click.stop>
      <div class="welcome-header">
        <div class="welcome-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
          </svg>
        </div>
        <h2 class="welcome-title">欢迎使用 ChromeNav 导航中心</h2>
        <p class="welcome-subtitle">您的个人书签管理助手</p>
      </div>
      
      <div class="welcome-body">
        <div class="intro-section">
          <h3>🚀 系统介绍</h3>
          <ul class="feature-list">
            <li>📁 <strong>智能分组管理</strong> - 将您的书签按类别整理，井井有条</li>
            <li>🔍 <strong>快速搜索功能</strong> - 支持书签名称、URL和描述的全文搜索</li>
            <li>🎨 <strong>多种布局模式</strong> - 网格和紧凑布局，适应不同使用习惯</li>
            <li>📱 <strong>响应式设计</strong> - 完美适配桌面端和移动端</li>
            <li>💾 <strong>本地存储</strong> - 所有数据保存在浏览器本地，安全可靠</li>
            <li>📤 <strong>数据导入导出</strong> - 支持备份和恢复您的书签数据</li>
          </ul>
        </div>
        
        <div class="warning-section">
          <h3>⚠️ 重要注意事项</h3>
          <div class="warning-box">
            <div class="warning-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
            </div>
            <div class="warning-content">
              <p><strong>请勿清除浏览器缓存！</strong></p>
              <p>您的所有书签数据都存储在浏览器本地缓存中。如果清除缓存，将会丢失所有书签数据。</p>
              <p class="warning-tips">
                <strong>建议：</strong>定期使用"数据管理"功能导出备份您的书签数据，以防意外丢失。
              </p>
            </div>
          </div>
        </div>
        
        <div class="tips-section">
          <h3>💡 使用小贴士</h3>
          <ul class="tips-list">
            <li>按 <kbd>Ctrl</kbd> + <kbd>,</kbd> 快速打开数据管理面板</li>
            <li>在搜索框中输入关键词，按回车可直接使用搜索引擎搜索</li>
            <li>点击搜索框左侧图标可切换搜索引擎（百度/Google）</li>
            <li>支持拖拽排序和批量管理书签</li>
          </ul>
        </div>
      </div>
      
      <div class="welcome-footer">
        <label class="dont-show-again">
          <input type="checkbox" v-model="dontShowAgain">
          <span class="checkmark"></span>
          不再显示此欢迎页面
        </label>
        <div class="welcome-actions">
          <button class="btn-secondary" @click="handleClose">稍后再说</button>
          <button class="btn-primary" @click="handleGetStarted">开始使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeModal',
  data() {
    return {
      dontShowAgain: false
    }
  },
  emits: ['close'],
  methods: {
    handleClose() {
      this.$emit('close', this.dontShowAgain)
    },
    
    handleGetStarted() {
      this.$emit('close', this.dontShowAgain)
      // 聚焦到搜索框
      this.$nextTick(() => {
        const searchInput = document.querySelector('.search-input')
        if (searchInput) {
          searchInput.focus()
        }
      })
    }
  }
}
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: welcome-overlay-fade-in 0.4s ease-out;
}

@keyframes welcome-overlay-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.welcome-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: welcome-content-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(20px);
}

@keyframes welcome-content-slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.welcome-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.welcome-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: welcome-glow 3s ease-in-out infinite;
}

@keyframes welcome-glow {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
  animation: welcome-icon-pulse 2s ease-in-out infinite;
}

@keyframes welcome-icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.welcome-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem;
}

.intro-section, .warning-section, .tips-section {
  margin: 1.5rem 0;
}

.intro-section h3, .warning-section h3, .tips-section h3 {
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-list, .tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li, .tips-list li {
  padding: 0.5rem 0;
  color: #4b5563;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.warning-section {
  margin: 2rem 0;
}

.warning-box {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.warning-icon {
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-content p {
  margin: 0 0 0.75rem;
  color: #374151;
  line-height: 1.5;
}

.warning-content p:last-child {
  margin-bottom: 0;
}

.warning-tips {
  font-size: 0.9rem;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #f59e0b;
}

kbd {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.welcome-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.dont-show-again {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
  user-select: none;
}

.dont-show-again input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.dont-show-again input[type="checkbox"]:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.dont-show-again input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.welcome-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary, .btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.2);
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
}

.btn-primary:active, .btn-secondary:active {
  transform: translateY(0);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .welcome-content {
    max-width: 95vw;
    margin: 0.5rem;
    border-radius: 16px;
  }
  
  .welcome-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .welcome-icon {
    width: 60px;
    height: 60px;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-body {
    padding: 0 1.5rem;
  }
  
  .welcome-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .welcome-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .btn-secondary, .btn-primary {
    flex: 1;
    text-align: center;
  }
  
  .warning-box {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .feature-list li, .tips-list li {
    font-size: 0.875rem;
  }
}
</style> 