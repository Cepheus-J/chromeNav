<template>
  <div class="nav-group">
    <div class="group-header">
      <div class="group-info">
        <h3 class="group-title">{{ group.name }}</h3>
        <p class="group-description">{{ group.description }}</p>
      </div>
      <div class="group-actions">
        <button @click="$emit('edit-group', group)" class="action-btn edit-btn">
          <span class="icon">✏️</span>
        </button>
        <button @click="$emit('delete-group', group.id)" class="action-btn delete-btn">
          <span class="icon">🗑️</span>
        </button>
      </div>
    </div>
    
    <div class="links-grid">
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
            <span class="icon">✏️</span>
          </button>
          <button @click="$emit('delete-link', group.id, link.id)" class="action-btn delete-btn">
            <span class="icon">🗑️</span>
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
  </div>
</template>

<script>
export default {
  name: 'NavGroup',
  props: {
    group: {
      type: Object,
      required: true
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
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.nav-group:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.group-info {
  flex: 1;
}

.group-title {
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.group-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}

.group-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.action-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.edit-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #3b82f6;
}

.delete-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #ef4444;
}

.icon {
  font-size: 0.9rem;
}

.links-grid {
  display: grid;
  gap: 0.75rem;
}

.link-item {
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.link-item:hover {
  background: white;
  border-color: #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.link-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  text-decoration: none;
  color: #1e293b;
}

.link-icon {
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
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
  color: #0f172a;
}

.link-description {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.3;
}

.link-actions {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
}

.add-link-item {
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  background: #fafbfc;
  transition: all 0.2s ease;
}

.add-link-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.add-link-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
}

.add-link-item:hover .add-link-btn {
  color: #3b82f6;
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .group-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .group-actions {
    align-self: flex-end;
  }
  
  .link-content {
    padding: 0.75rem;
  }
  
  .link-icon {
    width: 28px;
    height: 28px;
    margin-right: 0.75rem;
  }
}
</style>