<template>
  <div class="data-manager">
    <!-- 左侧导航 -->
    <div class="manager-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">数据管理</h2>
        <p class="sidebar-subtitle">管理您的导航数据</p>
      </div>
      
      <div class="sidebar-nav">
        <div 
          :class="['nav-item', { active: activeTab === 'export' }]"
          @click="activeTab = 'export'"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              <path fill="currentColor" d="M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/>
            </svg>
          </div>
          <div class="nav-content">
            <span class="nav-title">导出数据</span>
            <span class="nav-desc">备份您的导航链接</span>
          </div>
        </div>
        
        <div 
          :class="['nav-item', { active: activeTab === 'import' }]"
          @click="activeTab = 'import'"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              <path fill="currentColor" d="M12,11L16,15H13.5V18H10.5V15H8L12,11Z"/>
            </svg>
          </div>
          <div class="nav-content">
            <span class="nav-title">导入数据</span>
            <span class="nav-desc">恢复备份的数据</span>
          </div>
        </div>
      </div>
      
      <div class="sidebar-stats">
        <div class="stat-item">
          <span class="stat-number">{{ linkGroups.length }}</span>
          <span class="stat-label">分组</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalLinks }}</span>
          <span class="stat-label">链接</span>
        </div>
      </div>
    </div>
    
    <!-- 右侧内容 -->
    <div class="manager-content">
      <!-- 导出面板 -->
      <div v-if="activeTab === 'export'" class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">导出数据</h3>
          <p class="panel-subtitle">选择要导出的分组，生成备份文件</p>
        </div>
        
        <!-- 选择统计 -->
        <div class="selection-stats">
          <div class="stats-card">
            <span class="stats-number">{{ selectedGroups.length }}</span>
            <span class="stats-label">已选择分组</span>
          </div>
          <div class="stats-card">
            <span class="stats-number">{{ selectedLinksCount }}</span>
            <span class="stats-label">包含链接</span>
          </div>
        </div>
        
        <!-- 分组选择器 -->
        <div class="group-selector">
          <div class="selector-header">
            <h4>选择分组</h4>
            <label class="select-all-checkbox">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span class="checkbox-label">全选 ({{ linkGroups.length }})</span>
            </label>
          </div>
          
          <div class="groups-grid">
            <label 
              v-for="group in linkGroups" 
              :key="group.id"
              :class="['group-card', { selected: selectedGroups.includes(group.id) }]"
            >
              <input 
                type="checkbox" 
                :value="group.id"
                v-model="selectedGroups"
                class="group-checkbox"
              />
              <div class="group-card-content">
                <div class="group-card-header">
                  <h5 class="group-card-title">{{ group.name }}</h5>
                  <span class="group-card-count">{{ group.links?.length || 0 }}</span>
                </div>
                <p class="group-card-desc">{{ group.description || '暂无描述' }}</p>
              </div>
            </label>
          </div>
        </div>
        
        <!-- 导出选项 -->
        <div class="export-options">
          <h4>导出选项</h4>
          <label class="option-checkbox">
            <input type="checkbox" v-model="includeSettings" />
            <span class="checkbox-label">包含设置信息（背景、显示模式等）</span>
          </label>
        </div>
        
        <!-- 导出按钮 -->
        <div class="export-actions">
          <button 
            @click="exportData" 
            :disabled="selectedGroups.length === 0"
            class="btn btn-primary"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
            </svg>
            导出选中分组
          </button>
          <button @click="exportAll" class="btn btn-secondary">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H8V4H20V16Z"/>
            </svg>
            导出全部数据
          </button>
        </div>
      </div>

      <!-- 导入面板 -->
      <div v-if="activeTab === 'import'" class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">导入数据</h3>
          <p class="panel-subtitle">从文件或文本恢复您的导航数据</p>
        </div>
        
        <!-- 导入方式 -->
        <div class="import-methods">
          <div class="method-card">
            <div class="method-header">
              <div class="method-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div>
                <h4 class="method-title">文件导入</h4>
                <p class="method-desc">选择之前导出的 JSON 文件</p>
              </div>
            </div>
            <input 
              type="file" 
              ref="fileInput"
              accept=".json"
              @change="handleFileImport"
              class="file-input"
            />
            <button @click="$refs.fileInput?.click()" class="btn btn-outline">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              选择文件
            </button>
          </div>
          
          <div class="method-card">
            <div class="method-header">
              <div class="method-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H18A3,3 0 0,1 15,19V5A3,3 0 0,1 18,2H20V4H18A1,1 0 0,0 17,5V7M11,7H12A4,4 0 0,1 16,11V13A4,4 0 0,1 12,17H11V15H12A2,2 0 0,0 14,13V11A2,2 0 0,0 12,9H11V7M7,7H8A4,4 0 0,1 12,11V13A4,4 0 0,1 8,17H7V15H8A2,2 0 0,0 10,13V11A2,2 0 0,0 8,9H7V7M2,7H6V9H4V11H6V13H4V15H6V17H2V7Z"/>
                </svg>
              </div>
              <div>
                <h4 class="method-title">文本导入</h4>
                <p class="method-desc">粘贴 JSON 格式的数据</p>
              </div>
            </div>
            <textarea 
              v-model="importText"
              placeholder="请粘贴 JSON 格式的导出数据..."
              class="import-textarea"
              rows="6"
            ></textarea>
            <button 
              @click="importFromText" 
              :disabled="!importText.trim()"
              class="btn btn-outline"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
              </svg>
              从文本导入
            </button>
          </div>
        </div>
        
        <!-- 预览数据 -->
        <div class="import-preview" v-if="previewData">
          <div class="preview-header">
            <h4 class="preview-title">预览导入数据</h4>
            <div class="preview-stats">
              <span class="preview-stat">{{ previewData.linkGroups?.length || 0 }} 个分组</span>
              <span class="preview-stat">{{ getPreviewLinksCount() }} 个链接</span>
            </div>
          </div>
          
          <div class="preview-groups">
            <div 
              v-for="group in previewData.linkGroups" 
              :key="group.id"
              class="preview-group"
            >
              <div class="preview-group-header">
                <span class="preview-group-name">{{ group.name }}</span>
                <span class="preview-group-count">{{ group.links?.length || 0 }} 个链接</span>
              </div>
              <p class="preview-group-desc">{{ group.description || '暂无描述' }}</p>
            </div>
          </div>
          
          <div class="preview-actions">
            <button @click="confirmImport" class="btn btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
              </svg>
              确认导入
            </button>
            <button @click="cancelPreview" class="btn btn-outline">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { $error, $success } from '../utils/dialog.js'

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
    },
    selectedLinksCount() {
      return this.linkGroups
        .filter(group => this.selectedGroups.includes(group.id))
        .reduce((count, group) => count + (group.links?.length || 0), 0)
    },
    totalLinks() {
      return this.linkGroups.reduce((count, group) => count + (group.links?.length || 0), 0)
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
      if (this.selectedGroups.length === 0) {
        $error('请至少选择一个分组')
        return
      }
      
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
      $success(`成功导出 ${this.selectedGroups.length} 个分组`)
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
      $success('成功导出全部数据')
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
          $error('文件格式错误：' + error.message)
        }
      }
      reader.readAsText(file)
    },
    
    importFromText() {
      try {
        const data = JSON.parse(this.importText)
        this.previewData = data
      } catch (error) {
        $error('JSON 格式错误：' + error.message)
      }
    },
    
    confirmImport() {
      this.$emit('import', this.previewData)
      this.previewData = null
      this.importText = ''
      $success('数据导入成功')
    },
    
    cancelPreview() {
      this.previewData = null
      this.importText = ''
    },
    
    getPreviewLinksCount() {
      if (!this.previewData?.linkGroups) return 0
      return this.previewData.linkGroups.reduce((count, group) => 
        count + (group.links?.length || 0), 0
      )
    }
  }
}
</script>

<style scoped>
.data-manager {
  width: 100%;
  height: 100%;
  display: flex;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  min-height: 600px;
}

/* 左侧边栏 */
.manager-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sidebar-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-nav {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.nav-content {
  flex: 1;
}

.nav-title {
  display: block;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-desc {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-stats {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stat-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 右侧内容区 */
.manager-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: white;
}

.content-panel {
  max-width: 800px;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.panel-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* 选择统计 */
.selection-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stats-card {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.stats-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 分组选择器 */
.group-selector {
  margin-bottom: 2rem;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.selector-header h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.select-all-checkbox,
.option-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  color: #374151;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.group-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  position: relative;
}

.group-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.group-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.group-checkbox {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 16px;
  height: 16px;
}

.group-card-content {
  padding-right: 2rem;
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.group-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.group-card-count {
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.group-card-desc {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

/* 导出选项 */
.export-options {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.export-options h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

/* 导出按钮 */
.export-actions {
  display: flex;
  gap: 1rem;
}

/* 导入方式 */
.import-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.method-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.method-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.method-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.method-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.method-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.method-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.file-input {
  display: none;
}

.import-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.import-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 预览数据 */
.import-preview {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #93c5fd;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.preview-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.preview-stats {
  display: flex;
  gap: 1rem;
}

.preview-stat {
  background: rgba(59, 130, 246, 0.2);
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.preview-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preview-group {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.preview-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.preview-group-name {
  font-weight: 600;
  color: #1e40af;
}

.preview-group-count {
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
}

.preview-group-desc {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

/* 通用按钮样式 */
.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  text-decoration: none;
  flex: 1;
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-outline {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-outline:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .data-manager {
    flex-direction: column;
  }
  
  .manager-sidebar {
    width: 100%;
    padding: 1.5rem;
  }
  
  .sidebar-nav {
    flex: none;
  }
  
  .nav-item {
    margin-bottom: 0.5rem;
  }
  
  .sidebar-stats {
    margin-top: 1rem;
  }
  
  .import-methods {
    grid-template-columns: 1fr;
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  .export-actions,
  .preview-actions {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .manager-content {
    padding: 1rem;
  }
  
  .selection-stats {
    flex-direction: column;
  }
  
  .preview-groups {
    grid-template-columns: 1fr;
  }
}
</style>