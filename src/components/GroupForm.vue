<template>
  <div class="form-container">
    <h2 class="form-title">
      {{ group ? '编辑分组' : '添加新分组' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="group-form">
      <div class="form-group">
        <label for="groupName" class="form-label">分组名称</label>
        <input
          id="groupName"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="请输入分组名称"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="groupDescription" class="form-label">分组描述</label>
        <textarea
          id="groupDescription"
          v-model="formData.description"
          class="form-textarea"
          placeholder="请输入分组描述（可选）"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn btn-cancel">
          取消
        </button>
        <button type="submit" class="btn btn-primary">
          {{ group ? '保存' : '添加' }}
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
        alert('请输入分组名称')
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
  color: #333;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.group-form {
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
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>