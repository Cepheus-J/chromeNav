<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="group-form">
      <div class="form-group">
        <label for="groupName" class="form-label">
          <span class="label-text">分组名称</span>
          <span class="label-required">*</span>
        </label>
        <div class="input-wrapper">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
            </svg>
          </div>
          <input
            id="groupName"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="请输入分组名称"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="groupDescription" class="form-label">
          <span class="label-text">分组描述</span>
          <span class="label-optional">（可选）</span>
        </label>
        <div class="input-wrapper">
          <textarea
            id="groupDescription"
            v-model="formData.description"
            class="form-textarea"
            placeholder="请输入分组描述，帮助您更好地管理链接"
            rows="4"
          ></textarea>
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
          <span>{{ group ? '保存修改' : '创建分组' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'GroupForm',
  props: {
    group: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        description: ''
      }
    }
  },
  
  mounted() {
    if (this.group) {
      this.formData = {
        name: this.group.name || '',
        description: this.group.description || ''
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
        $error('请输入分组名称')
        return
      }
      
      const groupData = {
        ...this.formData,
        name: this.formData.name.trim(),
        description: this.formData.description.trim()
      }
      
      if (this.group) {
        groupData.id = this.group.id
        groupData.links = this.group.links || []
      }
      
      this.$emit('save', groupData)
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 2rem;
  background: white;
}

.group-form {
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
  min-height: 120px;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
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
}
</style>