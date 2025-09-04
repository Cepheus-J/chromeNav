<template>
  <div 
    :class="['nav-group', `layout-${layout}`]"
    :data-group-id="group.id"
    draggable="true"
    @dragstart="handleGroupDragStart"
    @dragend="handleGroupDragEnd"
    @dragover="handleGroupDragOver"
    @drop="handleGroupDrop"
  >
    <div class="group-header">
      <div class="group-info">
        <h3 class="group-title">{{ group.name }}</h3>
        <p class="group-description">{{ group.description }}</p>
      </div>
      <div class="group-actions">
        <button @click="$emit('edit-group', group)" class="action-btn edit-btn">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
          </svg>
        </button>
        <button @click="$emit('delete-group', group.id)" class="action-btn delete-btn">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 网格布局的链接显示 -->
    <div v-if="layout === 'grid'" class="links-grid">
      <div 
        v-for="link in group.links" 
        :key="link.id"
        class="link-item"
        draggable="true"
        @dragstart="handleLinkDragStart($event, link.id)"
        @dragend="handleLinkDragEnd"
        @dragover="handleLinkDragOver"
        @drop="handleLinkDrop($event, link.id)"
      >
        <a 
          :href="link.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="link-content"
        >
          <div class="link-icon">
            <img 
              :src="`https://www.google.com/s2/favicons?domain=${getDomain(link.url)}`" 
              :alt="link.name"
              @error="handleIconError"
            />
          </div>
          <div class="link-info">
            <h4 class="link-name">{{ link.name }}</h4>
            <p class="link-description">{{ link.description }}</p>
          </div>
        </a>
        <div class="link-actions">
          <button @click="$emit('edit-link', group.id, link)" class="action-btn edit-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
            </svg>
          </button>
          <button @click="$emit('delete-link', group.id, link.id)" class="action-btn delete-btn">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="add-link-item">
        <button @click="$emit('add-link', group.id)" class="add-link-btn">
          <span class="plus-icon">+</span>
          添加链接
        </button>
      </div>
    </div>

    <!-- 紧凑布局的链接显示 -->
    <div v-else-if="layout === 'compact'" class="links-compact">
      <div class="links-compact-grid">
        <a
          v-for="link in group.links" 
          :key="link.id"
          :href="link.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="link-item-compact"
          :title="`${link.name} - ${link.description}`"
          draggable="true"
          @dragstart="handleLinkDragStart($event, link.id)"
          @dragend="handleLinkDragEnd"
          @dragover="handleLinkDragOver"
          @drop="handleLinkDrop($event, link.id)"
        >
          <div class="link-icon-compact">
            <img 
              :src="`https://www.google.com/s2/favicons?domain=${getDomain(link.url)}`" 
              :alt="link.name"
              @error="handleIconError"
            />
          </div>
          <span class="link-name-compact">{{ link.name }}</span>
          <div class="link-actions-compact">
            <button @click.prevent="$emit('edit-link', group.id, link)" class="action-btn-compact edit-btn">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
              </svg>
            </button>
            <button @click.prevent="$emit('delete-link', group.id, link.id)" class="action-btn-compact delete-btn">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
              </svg>
            </button>
          </div>
        </a>
        
        <button @click="$emit('add-link', group.id)" class="add-link-compact">
          <span class="plus-icon">+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavGroup',
  props: {
    group: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      default: 'grid'
    }
  },
  emits: [
    'edit-group', 'delete-group', 'add-link', 'edit-link', 'delete-link',
    'group-drag-start', 'group-drag-end', 'group-drag-over', 'group-drop',
    'link-drag-start', 'link-drag-end', 'link-drop'
  ],
  methods: {
    getDomain(url) {
      try {
        return new URL(url).hostname
      } catch {
        return ''
      }
    },
    
    handleIconError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTk5IiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
    },

    // 分组拖拽处理
    handleGroupDragStart(event) {
      this.$emit('group-drag-start', event, this.group.id)
    },

    handleGroupDragEnd(event) {
      this.$emit('group-drag-end', event)
    },

    handleGroupDragOver(event) {
      this.$emit('group-drag-over', event)
    },

    handleGroupDrop(event) {
      this.$emit('group-drop', event, this.group.id)
    },

    // 链接拖拽处理
    handleLinkDragStart(event, linkId) {
      event.stopPropagation() // 防止触发分组拖拽
      event.target.classList.add('dragging')
      this.$emit('link-drag-start', event, this.group.id, linkId)
    },

    handleLinkDragEnd(event) {
      event.target.classList.remove('dragging')
      // 移除所有拖拽over状态
      document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over')
      })
      this.$emit('link-drag-end', event)
    },

    handleLinkDragOver(event) {
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'move'
      
      // 添加视觉反馈
      const target = event.currentTarget
      if (!target.classList.contains('dragging')) {
        target.classList.add('drag-over')
      }
    },

    handleLinkDrop(event, targetLinkId) {
      event.preventDefault()
      event.stopPropagation()
      
      // 移除视觉反馈
      event.currentTarget.classList.remove('drag-over')
      
      this.$emit('link-drop', event, this.group.id, targetLinkId)
    }
  }
}
</script>

<style scoped>
.nav-group {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

/* 浅色主题下的卡片样式 - 超透明风格 */
[data-theme="light"] .nav-group {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

[data-theme="light"] .nav-group:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* 浅色主题下的文本颜色 */
[data-theme="light"] .nav-group .group-title {
  color: rgba(0, 0, 0, 0.9);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

[data-theme="light"] .nav-group .group-description {
  color: rgba(0, 0, 0, 0.6);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

[data-theme="light"] .nav-group .link-name {
  color: rgba(0, 0, 0, 0.9);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

[data-theme="light"] .nav-group .link-description {
  color: rgba(0, 0, 0, 0.6);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

[data-theme="light"] .nav-group .add-link-btn {
  color: rgba(0, 0, 0, 0.7);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

[data-theme="light"] .nav-group .add-link-item:hover .add-link-btn {
  color: rgba(0, 0, 0, 0.9);
}

/* 浅色主题下的链接项样式 - 极简透明 */
[data-theme="light"] .nav-group .link-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px) saturate(1.5);
}

[data-theme="light"] .nav-group .link-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.04),
    0 0 20px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

[data-theme="light"] .nav-group .link-item:hover .link-name {
  color: rgba(0, 0, 0, 0.95);
  text-shadow: 
    0 1px 2px rgba(255, 255, 255, 0.9),
    0 0 8px rgba(255, 255, 255, 0.6);
}

[data-theme="light"] .nav-group .add-link-item {
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="light"] .nav-group .add-link-item:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

/* 深色主题下的卡片样式 */
[data-theme="dark"] .nav-group {
  background: var(--bg-glass);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 添加闪光效果 */
.nav-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
  z-index: 0;
}

.nav-group:hover::before {
  left: 100%;
}

/* 确保内容在闪光效果之上 */
.nav-group > * {
  position: relative;
  z-index: 1;
}

.nav-group:hover {
  background: var(--bg-glass-hover);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

[data-theme="dark"] .nav-group:hover {
  background: var(--bg-glass-hover);
  border-color: rgba(255, 255, 255, 0.15);
}

/* 拖拽状态样式 */
.nav-group.dragging {
  opacity: 0.6;
  transform: rotate(2deg) scale(0.95);
  z-index: 1000;
}

.nav-group.drag-over {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.02);
}

.link-item.dragging {
  opacity: 0.6;
  transform: rotate(1deg) scale(0.95);
  z-index: 1000;
}

.link-item.drag-over {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.link-item-compact.dragging {
  opacity: 0.6;
  transform: scale(0.95);
  z-index: 1000;
}

.link-item-compact.drag-over {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: #3b82f6 !important;
}

/* 入场动画 */
@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 为不同位置的卡片添加延迟 */
.nav-group:nth-child(1) { animation-delay: 0.1s; }
.nav-group:nth-child(2) { animation-delay: 0.2s; }
.nav-group:nth-child(3) { animation-delay: 0.3s; }
.nav-group:nth-child(4) { animation-delay: 0.4s; }
.nav-group:nth-child(5) { animation-delay: 0.5s; }
.nav-group:nth-child(6) { animation-delay: 0.6s; }

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.group-info {
  flex: 1;
}

.group-title {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.group-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.group-actions {
  display: flex;
  gap: 0.5rem;
}

/* 分组标题的操作按钮始终显示 */
.group-actions .action-btn {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(0) !important;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  visibility: hidden;
  transform: translateX(10px) scale(0.8);
  position: relative;
  overflow: hidden;
}

/* 按钮波纹效果 */
.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.action-btn:active::before {
  width: 40px;
  height: 40px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  color: #93c5fd;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
}

/* SVG 图标样式 */
.action-btn svg {
  transition: all 0.2s ease;
}

.links-grid {
  display: grid;
  gap: 0.75rem;
}

.link-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

/* 链接项闪光效果 */
.link-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.4s ease;
  z-index: 0;
}

.link-item:hover::before {
  left: 100%;
}

/* 确保链接内容在闪光效果之上 */
.link-content {
  position: relative;
  z-index: 1;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 0 20px rgba(255, 255, 255, 0.1);
  transform: translateY(-3px) scale(1.02);
}

.link-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.625rem;
  text-decoration: none;
  color: white;
}

.link-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.625rem;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

/* 图标发光效果 */
.link-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.link-item:hover .link-icon::after {
  opacity: 1;
}

.link-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: all 0.3s ease;
  z-index: 1;
  position: relative;
}

.link-item:hover .link-icon img {
  transform: scale(1.15) rotate(8deg);
  filter: brightness(1.3) saturate(1.2);
}

.link-info {
  flex: 1;
}

.link-name {
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.link-item:hover .link-name {
  color: #fff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4), 
    0 0 12px rgba(255, 255, 255, 0.4),
    0 0 20px rgba(59, 130, 246, 0.3);
  transform: translateX(2px);
}

.link-description {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.link-actions {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
}

/* 链接项悬停时显示操作按钮 */
.link-item:hover .link-actions .action-btn {
  opacity: 1;
  visibility: visible;
  transform: translateX(0) scale(1);
}

/* 按钮序列动画 */
.link-item:hover .link-actions .action-btn:first-child {
  transition-delay: 0.1s;
}

.link-item:hover .link-actions .action-btn:last-child {
  transition-delay: 0.2s;
}

.add-link-item {
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.add-link-item:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.add-link-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.add-link-item:hover .add-link-btn {
  color: white;
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .nav-group {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .nav-group .group-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    flex-direction: row !important;
  }
  
  .nav-group .group-info {
    flex: 1;
    min-width: 0;
  }
  
  .nav-group .group-title {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }
  
  .nav-group .group-description {
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.8;
  }
  
  .nav-group .group-actions {
    gap: 0.375rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .nav-group .action-btn {
    width: 28px !important;
    height: 28px !important;
    padding: 0.25rem !important;
    flex-shrink: 0;
  }
  
  .nav-group .links-grid {
    gap: 0.5rem;
    display: grid;
  }
  
  .nav-group .link-item {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-group .link-content {
    gap: 0.75rem;
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 0.75rem;
  }
  
  .nav-group .link-icon {
    width: 20px;
    height: 20px;
    margin-right: 0.5rem;
  }
  
  .nav-group .link-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  
  .nav-group .link-name {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }
  
  .nav-group .link-description {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.8;
  }
  
  .nav-group .link-actions {
    gap: 0.25rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 0.5rem;
  }
  
  .nav-group .link-actions .action-btn {
    width: 24px !important;
    height: 24px !important;
    padding: 0.2rem !important;
    flex-shrink: 0;
  }
  
  .nav-group .add-link-btn {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}

/* =========================
   布局特定样式
   ========================= */

/* 紧凑布局样式 */
.nav-group.layout-compact {
  padding: 1rem;
}

.nav-group.layout-compact .group-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
}

.nav-group.layout-compact .group-title {
  font-size: 0.9rem;
}

.nav-group.layout-compact .group-description {
  font-size: 0.75rem;
}

.nav-group.layout-compact .links-compact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.nav-group.layout-compact .link-item-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 80px;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

/* 紧凑布局闪光效果 */
.nav-group.layout-compact .link-item-compact::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.3s ease;
  z-index: 0;
}

.nav-group.layout-compact .link-item-compact:hover::before {
  left: 100%;
}

.nav-group.layout-compact .link-item-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.15),
    0 0 15px rgba(255, 255, 255, 0.1);
}

.nav-group.layout-compact .link-icon-compact {
  width: 20px;
  height: 20px;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.nav-group.layout-compact .link-item-compact:hover .link-icon-compact {
  transform: scale(1.2) rotate(10deg);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-group.layout-compact .link-icon-compact img {
  width: 14px;
  height: 14px;
}

.nav-group.layout-compact .link-name-compact {
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.nav-group.layout-compact .link-item-compact:hover .link-name-compact {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(255, 255, 255, 0.2);
  color: #fff;
}

.nav-group.layout-compact .link-actions-compact {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: flex;
  gap: 0.125rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.nav-group.layout-compact .link-item-compact:hover .link-actions-compact {
  opacity: 1;
  visibility: visible;
}

.nav-group.layout-compact .action-btn-compact {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.nav-group.layout-compact .action-btn-compact:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-group.layout-compact .action-btn-compact.edit-btn:hover {
  background: rgba(59, 130, 246, 0.8);
  border-color: rgba(59, 130, 246, 0.5);
  color: #93c5fd;
}

.nav-group.layout-compact .action-btn-compact.delete-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
}

.nav-group.layout-compact .add-link-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;
  font-size: 0.7rem;
}

.nav-group.layout-compact .add-link-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.nav-group.layout-compact .add-link-compact .plus-icon {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}
</style>