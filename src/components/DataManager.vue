<template>
  <div class="data-manager">
    <h2 class="manager-title">数据管理</h2>
    
    <div class="manager-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'export' }]"
        @click="activeTab = 'export'"
      >
        导出数据
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'import' }]"
        @click="activeTab = 'import'"
      >
        导入数据
      </button>
    </div>

    <!-- 导出数据面板 -->
    <div v-if="activeTab === 'export'" class="export-panel">
      <h3 class="panel-title">选择要导出的分组</h3>
      
      <div class="group-selector">
        <label class="select-all">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
          <span>全选</span>
        </label>
        
        <div class="group-list">
          <label 
            v-for="group in linkGroups" 
            :key="group.id"
            class="group-item"
          >
            <input 
              type="checkbox" 
              :value="group.id"
              v-model="selectedGroups"
            />
            <div class="group-info">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-count">{{ group.links?.length || 0 }} 个链接</span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="export-options">
        <label class="option-item">
          <input 
            type="checkbox" 
            v-model="includeSettings"
          />
          <span>包含设置信息（背景、显示模式等）</span>
        </label>
      </div>
      
      <div class="export-actions">
        <button 
          @click="exportData" 
          :disabled="selectedGroups.length === 0"
          class="btn btn-primary"
        >
          <span>📥</span>
          导出选中分组 ({{ selectedGroups.length }})
        </button>
        <button @click="exportAll" class="btn btn-secondary">
          <span>📦</span>
          导出所有数据
        </button>
      </div>
    </div>

    <!-- 导入数据面板 -->
    <div v-if="activeTab === 'import'" class="import-panel">
      <h3 class="panel-title">导入数据</h3>
      
      <div class="import-methods">
        <div class="method-card">
          <h4>文件导入</h4>
          <p>选择之前导出的 JSON 文件</p>
          <input 
            type="file" 
            ref="fileInput"
            accept=".json"
            @change="handleFileImport"
            class="file-input"
          />
          <button @click="$refs.fileInput.click()" class="btn btn-outline">
            <span>📁</span>
            选择文件
          </button>
        </div>
        
        <div class="method-card">
          <h4>文本导入</h4>
          <p>粘贴 JSON 格式的数据</p>
          <textarea 
            v-model="importText"
            placeholder="请粘贴 JSON 格式的导出数据..."
            class="import-textarea"
            rows="8"
          ></textarea>
          <button 
            @click="importFromText" 
            :disabled="!importText.trim()"
            class="btn btn-outline"
          >
            <span>📋</span>
            从文本导入
          </button>
        </div>
      </div>
      
      <div class="import-preview" v-if="previewData">
        <h4>预览导入数据</h4>
        <div class="preview-content">
          <p>将导入 <strong>{{ previewData.linkGroups?.length || 0 }}</strong> 个分组：</p>
          <ul class="preview-list">
            <li v-for="group in previewData.linkGroups" :key="group.id">
              {{ group.name }} ({{ group.links?.length || 0 }} 个链接)
            </li>
          </ul>
          <div class="preview-actions">
            <button @click="confirmImport" class="btn btn-primary">
              <span>✅</span>
              确认导入
            </button>
            <button @click="previewData = null" class="btn btn-outline">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="manager-footer">
      <button @click="$emit('close')" class="btn btn-cancel">
        关闭
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataManager',
  props: {
    linkGroups: {
      type: Array,
      required: true
    }
  },
  emits: ['import', 'close'],
  data() {
    return {
      activeTab: 'export',
      selectedGroups: [],
      includeSettings: true,
      importText: '',
      previewData: null
    }
  },
  computed: {
    isAllSelected() {
      return this.selectedGroups.length === this.linkGroups.length && this.linkGroups.length > 0
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedGroups = []
      } else {
        this.selectedGroups = this.linkGroups.map(group => group.id)
      }
    },
    
    exportData() {
      const selectedGroupsData = this.linkGroups.filter(group => 
        this.selectedGroups.includes(group.id)
      )
      
      const exportData = {
        linkGroups: selectedGroupsData,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      if (this.includeSettings) {
        const savedData = localStorage.getItem('navData')
        if (savedData) {
          const data = JSON.parse(savedData)
          exportData.settings = {
            currentBackground: data.currentBackground,
            displayMode: data.displayMode
          }
        }
      }
      
      this.downloadJSON(exportData, `navhub-selected-${this.getDateString()}.json`)
    },
    
    exportAll() {
      const savedData = localStorage.getItem('navData')
      let exportData = {
        linkGroups: this.linkGroups,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      if (savedData) {
        const data = JSON.parse(savedData)
        exportData = {
          ...data,
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
      }
      
      this.downloadJSON(exportData, `navhub-full-backup-${this.getDateString()}.json`)
    },
    
    downloadJSON(data, filename) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    
    getDateString() {
      const now = new Date()
      return now.toISOString().split('T')[0]
    },
    
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          this.previewData = data
        } catch (error) {
          alert('文件格式错误：' + error.message)
        }
      }
      reader.readAsText(file)
    },
    
    importFromText() {
      try {
        const data = JSON.parse(this.importText)
        this.previewData = data
      } catch (error) {
        alert('JSON 格式错误：' + error.message)
      }
    },
    
    confirmImport() {
      this.$emit('import', this.previewData)
      this.previewData = null
      this.importText = ''
    }
  }
}
</script>

<style scoped>
.data-manager {
  color: #333;
  max-width: 600px;
  width: 100%;
}

.manager-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.manager-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #3b82f6;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.group-selector {
  margin-bottom: 1.5rem;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
  cursor: pointer;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.group-item:hover {
  background: #f1f5f9;
}

.group-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.group-name {
  font-weight: 500;
  color: #374151;
}

.group-count {
  font-size: 0.875rem;
  color: #64748b;
}

.export-options {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.export-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.import-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.method-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.method-card h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-weight: 600;
}

.method-card p {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.file-input {
  display: none;
}

.import-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.import-preview {
  padding: 1.5rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.import-preview h4 {
  margin: 0 0 1rem 0;
  color: #0369a1;
}

.preview-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.preview-list li {
  margin-bottom: 0.5rem;
  color: #374151;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-outline {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.btn-cancel:hover {
  background: #e9ecef;
  color: #495057;
}

.manager-footer {
  margin-top: 1.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .import-methods {
    grid-template-columns: 1fr;
  }
  
  .export-actions {
    flex-direction: column;
  }
  
  .preview-actions {
    flex-direction: column;
  }
}
</style>