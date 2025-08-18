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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

.nav-group:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.group-info {
  flex: 1;
}

.group-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.group-description {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.group-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(127, 140, 141, 0.1);
  border: 1px solid rgba(127, 140, 141, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.action-btn:hover {
  background: rgba(127, 140, 141, 0.15);
  transform: scale(1.05);
}

.edit-btn:hover {
  background: rgba(52, 152, 219, 0.15);
  border-color: rgba(52, 152, 219, 0.3);
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.15);
  border-color: rgba(231, 76, 60, 0.3);
}

.icon {
  font-size: 0.9rem;
}

.links-grid {
  display: grid;
  gap: 1rem;
}

.link-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  text-decoration: none;
  color: #2c3e50;
}

.link-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.75rem;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(127, 140, 141, 0.1);
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
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.link-description {
  font-size: 0.8rem;
  color: #7f8c8d;
  line-height: 1.3;
}

.link-actions {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
}

.add-link-item {
  border: 2px dashed rgba(149, 165, 166, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.add-link-btn {
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
}

.add-link-btn:hover {
  color: #2c3e50;
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