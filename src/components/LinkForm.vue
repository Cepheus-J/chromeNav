<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="link-form">
      <div class="form-group">
        <label for="linkName" class="form-label">
          <span class="label-text">链接名称</span>
          <span class="label-required">*</span>
        </label>
        <div class="input-wrapper">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/>
            </svg>
          </div>
        <input
          id="linkName"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="请输入链接名称"
          required
        />
        </div>
      </div>
      
      <div class="form-group">
        <label for="linkUrl" class="form-label">
          <span class="label-text">链接地址</span>
          <span class="label-required">*</span>
        </label>
        <div class="input-wrapper">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
          </div>
        <input
          id="linkUrl"
          v-model="formData.url"
          type="url"
          class="form-input"
          placeholder="https://example.com"
          required
        />
        </div>
      </div>
      
      <div class="form-group">
        <label for="linkDescription" class="form-label">
          <span class="label-text">链接描述</span>
          <span class="label-optional">（可选）</span>
        </label>
        <div class="input-wrapper">
        <textarea
          id="linkDescription"
          v-model="formData.description"
          class="form-textarea"
            placeholder="请输入链接描述，帮助您记住这个链接的用途"
          rows="3"
        ></textarea>
        </div>
      </div>
      
      <div class="preview-section" v-if="formData.url && isValidUrl(formData.url)">
        <label class="form-label">
          <span class="label-text">链接预览</span>
          <span class="label-optional">（自动生成）</span>
        </label>
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
            <p class="preview-description" v-if="formData.description">{{ formData.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-cancel">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
          <span>取消</span>
        </button>
        <button type="submit" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
          </svg>
          <span>{{ link ? '保存修改' : '添加链接' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { $error } from '../utils/dialog.js'

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
        $error('请输入链接名称')
        return
      }
      
      if (!this.formData.url.trim()) {
        $error('请输入链接地址')
        return
      }
      
      if (!this.isValidUrl(this.formData.url)) {
        $error('请输入有效的链接地址')
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
  padding: 2rem;
  background: white;
}

.link-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.label-text {
  color: #111827;
}

.label-required {
  color: #ef4444;
  font-weight: 700;
}

.label-optional {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 400;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 1;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
  color: #111827;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.form-input:focus ~ .input-icon {
  color: #3b82f6;
}

.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
  color: #111827;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.preview-section {
  margin-top: 0.5rem;
}

.link-preview {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.link-preview:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-height: 48px;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-cancel {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
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