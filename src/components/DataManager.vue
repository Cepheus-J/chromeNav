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
        
        <div 
          :class="['nav-item', { active: activeTab === 'autoBackup' }]"
          @click="activeTab = 'autoBackup'"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1M12,7C10.34,7 9,8.34 9,10C9,11.66 10.34,13 12,13C13.66,13 15,11.66 15,10C15,8.34 13.66,7 12,7Z"/>
              <path fill="currentColor" d="M12,15C10,15 8,16 8,17V18H16V17C16,16 14,15 12,15Z"/>
            </svg>
          </div>
          <div class="nav-content">
            <span class="nav-title">自动备份</span>
            <span class="nav-desc">定时备份保护数据</span>
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
      
      <!-- 自动备份面板 -->
      <div v-if="activeTab === 'autoBackup'" class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">自动备份</h3>
          <p class="panel-subtitle">定时自动备份您的导航数据，防止数据丢失</p>
        </div>
        
        <!-- 自动备份设置 -->
        <div class="backup-settings">
          <!-- 启用开关 -->
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-info">
                <h4 class="setting-title">启用自动备份</h4>
                <p class="setting-desc">开启后将按设定间隔自动备份数据到本地</p>
              </div>
              <label class="toggle-switch">
                <input 
                  type="checkbox" 
                  v-model="autoBackupEnabled"
                  @change="toggleAutoBackup"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <!-- 备份间隔设置 -->
          <div v-if="autoBackupEnabled" class="setting-card">
            <div class="setting-header">
              <div class="setting-info">
                <h4 class="setting-title">备份间隔</h4>
                <p class="setting-desc">选择自动备份的时间间隔</p>
              </div>
            </div>
            <div class="interval-options">
              <label 
                v-for="option in backupIntervals" 
                :key="option.value"
                :class="['interval-option', { selected: backupInterval === option.value }]"
              >
                <input 
                  type="radio" 
                  :value="option.value"
                  v-model="backupInterval"
                  @change="updateBackupInterval"
                />
                <span class="option-content">
                  <span class="option-title">{{ option.label }}</span>
                  <span class="option-desc">{{ option.desc }}</span>
                </span>
              </label>
            </div>
          </div>
          
          <!-- 备份保留设置 -->
          <div v-if="autoBackupEnabled" class="setting-card">
            <div class="setting-header">
              <div class="setting-info">
                <h4 class="setting-title">备份保留</h4>
                <p class="setting-desc">设置保留多少个历史备份文件</p>
              </div>
            </div>
            <div class="retention-setting">
              <input 
                type="range" 
                min="3" 
                max="20" 
                v-model="maxBackupFiles"
                @input="updateMaxBackupFiles"
                class="retention-slider"
              />
              <div class="retention-info">
                <span class="retention-value">{{ maxBackupFiles }} 个文件</span>
                <span class="retention-desc">超出数量时自动删除最旧的备份</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 备份状态和历史 -->
        <div v-if="autoBackupEnabled" class="backup-status">
          <div class="status-card">
            <div class="status-header">
              <h4>备份状态</h4>
              <span :class="['status-badge', backupStatus]">{{ backupStatusText }}</span>
            </div>
            <div class="status-info">
              <div class="status-item">
                <span class="status-label">上次备份：</span>
                <span class="status-value">{{ lastBackupTime || '暂无' }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">下次备份：</span>
                <span class="status-value">{{ nextBackupTime || '计算中...' }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">备份文件：</span>
                <span class="status-value">{{ backupFiles.length }} 个</span>
              </div>
            </div>
            <div class="status-actions">
              <button @click="createManualBackup" class="btn btn-outline">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z"/>
                </svg>
                立即备份
              </button>
              <button @click="showBackupHistory = !showBackupHistory" class="btn btn-text">
                {{ showBackupHistory ? '隐藏历史' : '查看历史' }}
              </button>
            </div>
          </div>
          
          <!-- 备份历史列表 -->
          <div v-if="showBackupHistory" class="backup-history">
            <h4>备份历史</h4>
            <div v-if="backupFiles.length === 0" class="empty-history">
              <p>暂无备份文件</p>
            </div>
            <div v-else class="history-list">
              <div 
                v-for="backup in backupFiles" 
                :key="backup.id"
                class="history-item"
              >
                <div class="history-info">
                  <span class="history-name">{{ backup.name }}</span>
                  <span class="history-time">{{ formatDate(backup.timestamp) }}</span>
                  <span class="history-size">{{ formatSize(backup.size) }}</span>
                </div>
                <div class="history-actions">
                  <button @click="restoreBackup(backup)" class="btn btn-sm">恢复</button>
                  <button @click="downloadBackup(backup)" class="btn btn-sm btn-outline">下载</button>
                  <button @click="deleteBackup(backup.id)" class="btn btn-sm btn-danger">删除</button>
                </div>
              </div>
            </div>
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
      previewData: null,
      // 自动备份相关
      autoBackupEnabled: false,
      backupInterval: 24, // 小时
      maxBackupFiles: 10,
      backupStatus: 'idle', // idle, running, success, error
      lastBackupTime: null,
      nextBackupTime: null,
      backupFiles: [],
      showBackupHistory: false,
      backupTimer: null,
      backupIntervals: [
        { value: 1, label: '每小时', desc: '每1小时自动备份一次' },
        { value: 6, label: '每6小时', desc: '每6小时自动备份一次' },
        { value: 12, label: '每12小时', desc: '每12小时自动备份一次' },
        { value: 24, label: '每天', desc: '每24小时自动备份一次' },
        { value: 72, label: '每3天', desc: '每72小时自动备份一次' },
        { value: 168, label: '每周', desc: '每168小时自动备份一次' }
      ]
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
    },
    backupStatusText() {
      const statusMap = {
        idle: '待机中',
        running: '备份中...',
        success: '备份成功',
        error: '备份失败'
      }
      return statusMap[this.backupStatus] || '未知状态'
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
    },
    
    // 自动备份相关方法
    toggleAutoBackup() {
      this.saveBackupSettings()
      if (this.autoBackupEnabled) {
        this.startAutoBackup()
        $success('自动备份已启用')
      } else {
        this.stopAutoBackup()
        $success('自动备份已禁用')
      }
    },
    
    updateBackupInterval() {
      this.saveBackupSettings()
      if (this.autoBackupEnabled) {
        this.startAutoBackup() // 重新启动定时器
      }
    },
    
    updateMaxBackupFiles() {
      this.saveBackupSettings()
      this.cleanOldBackups()
    },
    
    startAutoBackup() {
      this.stopAutoBackup() // 先停止现有的定时器
      
      const intervalMs = this.backupInterval * 60 * 60 * 1000 // 转换为毫秒
      this.backupTimer = setInterval(() => {
        this.createAutoBackup()
      }, intervalMs)
      
      this.updateNextBackupTime()
    },
    
    stopAutoBackup() {
      if (this.backupTimer) {
        clearInterval(this.backupTimer)
        this.backupTimer = null
      }
      this.nextBackupTime = null
    },
    
    updateNextBackupTime() {
      if (this.autoBackupEnabled && this.backupInterval) {
        const now = new Date()
        const nextTime = new Date(now.getTime() + this.backupInterval * 60 * 60 * 1000)
        this.nextBackupTime = this.formatDate(nextTime.getTime())
      }
    },
    
    createAutoBackup() {
      this.createBackup('auto')
    },
    
    createManualBackup() {
      this.createBackup('manual')
    },
    
    createBackup(type = 'manual') {
      this.backupStatus = 'running'
      
      try {
        const backupData = {
          linkGroups: this.linkGroups,
          exportDate: new Date().toISOString(),
          version: '1.0',
          type: type
        }
        
        // 获取设置数据
        const savedData = localStorage.getItem('navData')
        if (savedData) {
          const data = JSON.parse(savedData)
          backupData.settings = {
            currentBackground: data.currentBackground,
            displayMode: data.displayMode,
            searchEngine: data.searchEngine
          }
        }
        
        const backupId = Date.now().toString()
        const backupName = `${type === 'auto' ? '自动备份' : '手动备份'}-${this.getDateString()}`
        const backupContent = JSON.stringify(backupData, null, 2)
        
        // 保存到localStorage
        const backup = {
          id: backupId,
          name: backupName,
          timestamp: Date.now(),
          size: backupContent.length,
          data: backupContent,
          type: type
        }
        
        this.backupFiles.unshift(backup)
        this.cleanOldBackups()
        this.saveBackupFiles()
        
        this.lastBackupTime = this.formatDate(backup.timestamp)
        this.updateNextBackupTime()
        this.backupStatus = 'success'
        
        if (type === 'manual') {
          $success('备份创建成功')
        }
        
        // 3秒后重置状态
        setTimeout(() => {
          if (this.backupStatus === 'success') {
            this.backupStatus = 'idle'
          }
        }, 3000)
        
      } catch (error) {
        this.backupStatus = 'error'
        console.error('创建备份失败:', error)
        if (type === 'manual') {
          $error('备份创建失败')
        }
        
        setTimeout(() => {
          this.backupStatus = 'idle'
        }, 3000)
      }
    },
    
    cleanOldBackups() {
      if (this.backupFiles.length > this.maxBackupFiles) {
        this.backupFiles = this.backupFiles
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, this.maxBackupFiles)
      }
    },
    
    restoreBackup(backup) {
      try {
        const backupData = JSON.parse(backup.data)
        this.$emit('import', backupData)
        $success('备份恢复成功')
        this.$emit('close')
      } catch (error) {
        $error('备份文件损坏，无法恢复')
      }
    },
    
    downloadBackup(backup) {
      this.downloadJSON(JSON.parse(backup.data), backup.name + '.json')
    },
    
    deleteBackup(backupId) {
      const index = this.backupFiles.findIndex(b => b.id === backupId)
      if (index !== -1) {
        this.backupFiles.splice(index, 1)
        this.saveBackupFiles()
        $success('备份文件已删除')
      }
    },
    
    saveBackupSettings() {
      const settings = {
        autoBackupEnabled: this.autoBackupEnabled,
        backupInterval: this.backupInterval,
        maxBackupFiles: this.maxBackupFiles,
        lastBackupTime: this.lastBackupTime
      }
      localStorage.setItem('autoBackupSettings', JSON.stringify(settings))
    },
    
    loadBackupSettings() {
      const settings = localStorage.getItem('autoBackupSettings')
      if (settings) {
        try {
          const data = JSON.parse(settings)
          this.autoBackupEnabled = data.autoBackupEnabled || false
          this.backupInterval = data.backupInterval || 24
          this.maxBackupFiles = data.maxBackupFiles || 10
          this.lastBackupTime = data.lastBackupTime || null
        } catch (error) {
          console.error('加载备份设置失败:', error)
        }
      }
    },
    
    saveBackupFiles() {
      try {
        localStorage.setItem('autoBackupFiles', JSON.stringify(this.backupFiles))
      } catch (error) {
        console.error('保存备份文件列表失败:', error)
      }
    },
    
    loadBackupFiles() {
      const files = localStorage.getItem('autoBackupFiles')
      if (files) {
        try {
          this.backupFiles = JSON.parse(files)
        } catch (error) {
          console.error('加载备份文件列表失败:', error)
          this.backupFiles = []
        }
      }
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
      return Math.round(bytes / (1024 * 1024)) + ' MB'
    }
  },
  
  mounted() {
    this.loadBackupSettings()
    this.loadBackupFiles()
    
    if (this.autoBackupEnabled) {
      this.startAutoBackup()
    }
  },
  
  beforeUnmount() {
    this.stopAutoBackup()
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

/* 自动备份样式 */
.backup-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.setting-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.setting-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.setting-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #e5e7eb;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background: #3b82f6;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 间隔选项样式 */
.interval-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.interval-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interval-option:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.interval-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.interval-option input {
  display: none;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-title {
  font-weight: 600;
  color: #111827;
}

.option-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 保留设置样式 */
.retention-setting {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.retention-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  appearance: none;
}

.retention-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.retention-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.retention-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.retention-value {
  font-weight: 600;
  color: #111827;
}

.retention-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 备份状态样式 */
.backup-status {
  margin-top: 2rem;
}

.status-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.idle {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.running {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.error {
  background: #fee2e2;
  color: #dc2626;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
}

.status-label {
  color: #6b7280;
}

.status-value {
  font-weight: 500;
  color: #111827;
}

.status-actions {
  display: flex;
  gap: 1rem;
}

/* 备份历史样式 */
.backup-history {
  margin-top: 1.5rem;
}

.backup-history h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.empty-history {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.history-name {
  font-weight: 500;
  color: #111827;
}

.history-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.history-size {
  font-size: 0.75rem;
  color: #9ca3af;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-text {
  background: transparent;
  color: #3b82f6;
  border: none;
  text-decoration: underline;
}

.btn-text:hover {
  color: #2563eb;
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
  
  .interval-options {
    grid-template-columns: 1fr;
  }
  
  .status-actions {
    flex-direction: column;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .history-actions {
    align-self: stretch;
  }
}
</style>