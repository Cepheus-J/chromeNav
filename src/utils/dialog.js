import { createApp } from 'vue'

// 创建对话框组件
const DialogComponent = {
  props: {
    title: String,
    message: String,
    type: {
      type: String,
      default: 'info'
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true
    }
  },
  template: `
    <div v-if="show" class="dialog-overlay" @click="handleCancel">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <div :class="['dialog-icon', type]">
            <svg v-if="type === 'success'" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
            </svg>
            <svg v-else-if="type === 'error'" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1,1 0 0,0 11,8V12A1,1 0 0,0 12,13A1,1 0 0,0 13,12V8A1,1 0 0,0 12,7M12,17.5A1.5,1.5 0 0,0 13.5,16A1.5,1.5 0 0,0 12,14.5A1.5,1.5 0 0,0 10.5,16A1.5,1.5 0 0,0 12,17.5Z"/>
            </svg>
            <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
          </div>
          <h3 class="dialog-title">{{ title }}</h3>
        </div>
        <div class="dialog-body">
          <p class="dialog-message">{{ message }}</p>
        </div>
        <div class="dialog-footer">
          <button v-if="showCancel" @click="handleCancel" class="dialog-btn btn-cancel">
            取消
          </button>
          <button @click="handleConfirm" :class="['dialog-btn', 'btn-' + type]">
            确定
          </button>
        </div>
      </div>
    </div>
  `,
  methods: {
    handleConfirm() {
      this.$emit('confirm')
      this.close()
    },
    handleCancel() {
      this.$emit('cancel')
      this.close()
    },
    close() {
      this.show = false
      this.$nextTick(() => {
        this.$emit('close')
      })
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    handleKeyDown(e) {
      if (e.key === 'Escape') {
        this.handleCancel()
      }
    },
    handleConfirm() {
      this.$emit('confirm')
      this.close()
    },
    handleCancel() {
      this.$emit('cancel')
      this.close()
    },
    close() {
      this.show = false
      this.$nextTick(() => {
        this.$emit('close')
      })
    }
  }
}

// 对话框样式
const dialogStyles = `
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  min-width: 320px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
}

.dialog-header {
  padding: 24px 24px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-icon.success {
  background: #f0f9ff;
  color: #0ea5e9;
}

.dialog-icon.error {
  background: #fef2f2;
  color: #ef4444;
}

.dialog-icon.warning {
  background: #fffbeb;
  color: #f59e0b;
}

.dialog-icon.info {
  background: #f0f9ff;
  color: #3b82f6;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.dialog-body {
  padding: 0 24px 24px;
}

.dialog-message {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.dialog-footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.btn-cancel {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-error {
  background: #ef4444;
  color: white;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

@media (max-width: 640px) {
  .dialog-content {
    margin: 1rem;
    min-width: auto;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
}
`

// 添加样式到页面
function addStyles() {
  if (document.getElementById('dialog-styles')) return
  
  const style = document.createElement('style')
  style.id = 'dialog-styles'
  style.textContent = dialogStyles
  document.head.appendChild(style)
}

// 显示对话框的通用函数
function showDialog(options) {
  addStyles()
  
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    const app = createApp({
      components: { DialogComponent },
      template: `
        <DialogComponent
          :title="title"
          :message="message"
          :type="type"
          :show-cancel="showCancel"
          @confirm="handleConfirm"
          @cancel="handleCancel"
          @close="cleanup"
        />
      `,
      data() {
        return options
      },
      methods: {
        handleConfirm() {
          resolve(true)
          this.cleanup()
        },
        handleCancel() {
          resolve(false)
          this.cleanup()
        },
        cleanup() {
          app.unmount()
          document.body.removeChild(container)
        }
      }
    })
    
    app.mount(container)
  })
}

// 导出方法
export function $confirm(message, options = {}) {
  return showDialog({
    title: options.title || '确认',
    message,
    type: options.type || 'warning',
    showCancel: true,
    ...options
  })
}

export function $alert(message, options = {}) {
  return showDialog({
    title: options.title || '提示',
    message,
    type: options.type || 'info',
    showCancel: false,
    ...options
  })
}

export function $success(message, options = {}) {
  return showDialog({
    title: options.title || '成功',
    message,
    type: 'success',
    showCancel: false,
    ...options
  })
}

export function $error(message, options = {}) {
  return showDialog({
    title: options.title || '错误',
    message,
    type: 'error',
    showCancel: false,
    ...options
  })
}

export function $warning(message, options = {}) {
  return showDialog({
    title: options.title || '警告',
    message,
    type: 'warning',
    showCancel: false,
    ...options
  })
} 