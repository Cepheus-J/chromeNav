<template>
  <div :class="['nav-group', `layout-${layout}`]">
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
  emits: ['edit-group', 'delete-group', 'add-link', 'edit-link', 'delete-link'],
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
    }
  }
}
</script>

<style scoped>
.nav-group {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-group:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

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
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.group-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  visibility: hidden;
  transform: translateX(10px);
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  text-decoration: none;
  color: white;
}

.link-icon {
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.link-info {
  flex: 1;
}

.link-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.125rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.link-description {
  font-size: 0.75rem;
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
  transform: translateX(0);
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
  transition: all 0.2s ease;
  position: relative;
  min-height: 80px;
  justify-content: center;
  text-align: center;
}

.nav-group.layout-compact .link-item-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
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