<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div 
      class="modal-content" 
      :style="{ width: width || '540px', maxWidth: width ? 'none' : '540px' }"
      @click.stop
    >
      <div v-if="title" class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
      <div v-else class="modal-content-no-header">
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '540px'
    }
  },
  emits: ['close'],
  mounted() {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', this.handleEscape)
  },
  
  beforeUnmount() {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', this.handleEscape)
  },
  
  methods: {
    handleEscape(event) {
      if (event.key === 'Escape') {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
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
  z-index: 1000;
  padding: 1rem;
  animation: modal-overlay-fade-in 0.3s ease-out;
}

@keyframes modal-overlay-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 540px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: modal-content-slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-content-slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 增强模态框动画效果 */
.modal-header {
  animation: modal-header-slide-in 0.5s ease-out 0.1s both;
}

.modal-body {
  animation: modal-body-fade-in 0.5s ease-out 0.2s both;
}

@keyframes modal-header-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modal-body-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-content-no-header {
  position: relative;
  height: 0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.close-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.close-btn:hover::before {
  width: 40px;
  height: 40px;
}

.close-btn svg {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.modal-content-no-header .close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.close-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.close-btn:hover svg {
  transform: rotate(90deg);
}

.close-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .modal-content {
    width: 100%;
    max-width: 100%;
    max-height: 95vh;
    margin: 0;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .close-btn {
    width: 28px;
    height: 28px;
    padding: 0.25rem;
  }
}
</style>