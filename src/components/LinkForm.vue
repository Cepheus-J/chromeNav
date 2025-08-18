<template>
  <div class="form-container">
    <h2 class="form-title">
      {{ link ? '编辑链接' : '添加新链接' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="link-form">
      <div class="form-group">
        <label for="linkName" class="form-label">链接名称</label>
        <input
          id="linkName"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="请输入链接名称"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="linkUrl" class="form-label">链接地址</label>
        <input
          id="linkUrl"
          v-model="formData.url"
          type="url"
          class="form-input"
          placeholder="https://example.com"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="linkDescription" class="form-label">链接描述</label>
        <textarea
          id="linkDescription"
          v-model="formData.description"
          class="form-textarea"
          placeholder="请输入链接描述（可选）"
          rows="3"
        ></textarea>
      </div>
      
      <div class="preview-section" v-if="formData.url && isValidUrl(formData.url)">
        <label class="form-label">预览</label>
        <div class="link-preview">
          <div class="preview-icon">
            <img 
              :src="`https://www.google.com/s2/favicons?domain=${getDomain(formData.url)}`" 
              :alt="formData.name"
              @error="handleIconError"
            />
          </div>
          <div class="preview-info">
            <h4 class="preview-name">{{ formData.name || '未命名链接' }}</h4>
            <p class="preview-url">{{ formData.url }}</p>
            <p class="preview-description">{{ formData.description || '暂无描述' }}</p>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-cancel">
          取消
        </button>
        <button type="submit" class="btn btn-primary">
          {{ link ? '保存' : '添加' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LinkForm',
  props: {
    link: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        url: '',
        description: ''
      }
    }
  },
  
  mounted() {
    if (this.link) {
      this.formData = {
        name: this.link.name || '',
        url: this.link.url || '',
        description: this.link.description || ''
      }
    }
    
    // 自动聚焦到第一个输入框
    this.$nextTick(() => {
      const firstInput = this.$el.querySelector('input')
      if (firstInput) {
        firstInput.focus()
      }
    })
  },
  
  methods: {
    handleSubmit() {
      if (!this.formData.name.trim()) {
        alert('请输入链接名称')
        return
      }
      
      if (!this.formData.url.trim()) {
        alert('请输入链接地址')
        return
      }
      
      if (!this.isValidUrl(this.formData.url)) {
        alert('请输入有效的链接地址')
        return
      }
      
      const linkData = {
        ...this.formData,
        name: this.formData.name.trim(),
        url: this.formData.url.trim(),
        description: this.formData.description.trim()
      }
      
      if (this.link) {
        linkData.id = this.link.id
      }
      
      this.$emit('save', linkData)
    },
    
    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch {
        return false
      }
    },
    
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
.form-container {
  color: #333;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.link-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.preview-section {
  margin-top: 0.5rem;
}

.link-preview {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.preview-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.preview-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.preview-info {
  flex: 1;
  min-width: 0;
}

.preview-name {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.preview-url {
  font-size: 0.85rem;
  color: #3498db;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.preview-description {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.3;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.btn-cancel:hover {
  background: #e9ecef;
  color: #495057;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .link-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .preview-icon {
    align-self: center;
  }
}
</style>