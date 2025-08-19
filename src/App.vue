<template>
  <div id="app">
    <!-- 全屏风景背景 -->
    <div :class="`background-animation ${currentBackground} ${displayMode}`">
      <!-- 增强的浮动几何图形 -->
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      
      <!-- 动态光线效果 -->
      <div class="light-rays">
        <div class="light-ray"></div>
        <div class="light-ray"></div>
        <div class="light-ray"></div>
        <div class="light-ray"></div>
        <div class="light-ray"></div>
      </div>
      
      <!-- 漂浮的能量球 -->
      <div class="energy-orbs">
        <div class="energy-orb"></div>
        <div class="energy-orb"></div>
        <div class="energy-orb"></div>
      </div>
      
      <!-- 轻微粒子效果 -->
      <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    </div>
    
    <!-- 现代化顶部功能区 -->
    <header class="modern-header">
      <div class="container">
        <!-- 左侧时间和日期 -->
        <div class="time-section">
          <div class="current-time">{{ currentTime }}</div>
          <div class="current-date">{{ currentDate }}</div>
        </div>
        
        <!-- 中央布局切换器 -->
        <div class="layout-section">
          <div class="layout-switcher">
            <button 
              v-for="layout in layoutOptions" 
              :key="layout.value"
              @click="switchLayout(layout.value)"
              :class="['layout-btn', { active: currentLayout === layout.value }]"
              :title="layout.name"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" :d="layout.icon"/>
              </svg>
              <span class="layout-name">{{ layout.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- 右侧搜索区域 -->
        <div class="search-section">
          <div class="search-container">
            <button @click="toggleSearchEngine" class="search-engine-icon left-icon" :title="searchEngineTitle">
              <!-- 百度图标 -->
              <svg v-if="searchEngine === 'baidu'" class="engine-logo baidu-logo" viewBox="0 0 100 100" width="20" height="20">
                <circle cx="50" cy="50" r="45" fill="#2932E1"/>
                <path d="M30 35c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9zm23 0c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9zM25 55c0-3 2-5 5-5s5 2 5 5v10c0 8 6 14 14 14h2c8 0 14-6 14-14V55c0-3 2-5 5-5s5 2 5 5v10c0 14-11 25-25 25h-1c-14 0-25-11-25-25V55z" fill="white"/>
              </svg>
              <!-- Chrome图标 -->
              <svg v-else class="engine-logo chrome-logo" viewBox="0 0 100 100" width="20" height="20">
                <circle cx="50" cy="50" r="45" fill="#4285F4"/>
                <circle cx="50" cy="50" r="20" fill="white"/>
                <circle cx="50" cy="50" r="15" fill="#4285F4"/>
                <path d="M50 15 A35 35 0 0 1 80 35 L65 50 A15 15 0 0 1 50 35 Z" fill="#EA4335"/>
                <path d="M20 65 A35 35 0 0 1 50 15 L50 35 A15 15 0 0 1 35 50 Z" fill="#FBBC05"/>
                <path d="M80 35 A35 35 0 0 1 20 65 L35 50 A15 15 0 0 1 50 35 Z" fill="#34A853"/>
              </svg>
            </button>
            <input 
              v-model="searchQuery" 
              type="text" 
              :placeholder="searchPlaceholder" 
              class="search-input"
              @input="handleSearch"
              @keydown="handleKeydown"
              @keyup.enter="handleEnterSearch"
            />
            <button @click="showDataManager = true" class="search-settings-btn" title="数据管理">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M4,3H20A1,1 0 0,1 21,4V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V4A1,1 0 0,1 4,3M4,8H20A1,1 0 0,1 21,9V11A1,1 0 0,1 20,12H4A1,1 0 0,1 3,11V9A1,1 0 0,1 4,8M4,13H20A1,1 0 0,1 21,14V16A1,1 0 0,1 20,17H4A1,1 0 0,1 3,16V14A1,1 0 0,1 4,13M4,18H20A1,1 0 0,1 21,19V21A1,1 0 0,1 20,22H4A1,1 0 0,1 3,21V19A1,1 0 0,1 4,18Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>







    <!-- 应用程序区域 -->
    <div class="apps-section">
      <div class="container">
        <div :class="['apps-grid', `layout-${currentLayout}`]">
          <!-- 搜索无结果时的提示 -->
          <div v-if="searchQuery && filteredLinkGroups.length === 0" class="no-results-card">
            <div class="no-results-content">
              <svg class="no-results-icon" viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M15.5,14H20.5L14.5,8H9.5L15.5,14M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
              <h3 class="no-results-title">未找到相关书签</h3>
              <p class="no-results-text">没有找到包含 "{{ searchQuery }}" 的书签</p>
              <button @click="performSearch" class="search-engine-search-btn">
                <svg v-if="searchEngine === 'baidu'" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                使用{{ searchEngine === 'baidu' ? '百度' : 'Google' }}搜索 "{{ searchQuery }}"
              </button>
            </div>
          </div>

          <!-- 正常的分组显示 -->
          <NavGroup 
            v-for="group in filteredLinkGroups" 
            :key="group.id"
            :group="group"
            :layout="currentLayout"
            @edit-group="editGroup"
            @delete-group="deleteGroup"
            @add-link="addLink"
            @edit-link="editLink"
            @delete-link="deleteLink"
          />
          
          <!-- 只在没有搜索或有搜索结果时显示添加分组卡片 -->
          <div v-if="!searchQuery || filteredLinkGroups.length > 0" class="add-group-card" @click="addNewGroup">
            <button class="add-group-btn">
              <div class="add-icon">+</div>
              <span>添加新分组</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加分组模态框 -->
    <Modal v-if="showAddGroupModal" @close="cancelGroupEdit">
      <GroupForm 
        :group="null"
        @save="saveGroup"
        @cancel="cancelGroupEdit"
      />
    </Modal>

    <!-- 编辑分组模态框 -->
    <Modal v-if="showEditGroupModal" @close="showEditGroupModal = false">
      <GroupForm 
        :group="editingGroup"
        @save="saveGroup"
        @cancel="cancelGroupEdit"
      />
    </Modal>

    <!-- 添加/编辑链接模态框 -->
    <Modal v-if="showLinkModal" @close="showLinkModal = false">
      <LinkForm 
        :link="editingLink"
        @save="saveLink"
        @cancel="cancelLinkEdit"
      />
    </Modal>

    <!-- 数据管理模态框 -->
    <Modal 
      v-if="showDataManager" 
      title="数据管理"
      width="1200px"
      @close="showDataManager = false"
    >
      <DataManager 
        :linkGroups="linkGroups"
        @import="importData"
        @close="showDataManager = false"
      />
    </Modal>
  </div>
</template>

<script>
import NavGroup from './components/NavGroup.vue'
import Modal from './components/Modal.vue'
import GroupForm from './components/GroupForm.vue'
import LinkForm from './components/LinkForm.vue'
import DataManager from './components/DataManager.vue'

export default {
  name: 'App',
  components: {
    NavGroup,
    Modal,
    GroupForm,
    LinkForm,
    DataManager
  },
  data() {
    return {
      linkGroups: [
        {
          id: 1,
          name: '开发工具',
          description: '常用的开发相关网站',
          links: [
            { id: 1, name: 'GitHub', url: 'https://github.com', description: '代码托管平台' },
            { id: 2, name: 'Vue.js', url: 'https://vuejs.org', description: 'Vue官方文档' },
            { id: 3, name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web开发文档' }
          ]
        },
        {
          id: 2,
          name: '常用网站',
          description: '日常浏览的网站',
          links: [
            { id: 4, name: '百度', url: 'https://www.baidu.com', description: '搜索引擎' },
            { id: 5, name: '知乎', url: 'https://www.zhihu.com', description: '知识分享社区' }
          ]
        }
      ],
      showAddGroupModal: false,
      showEditGroupModal: false,
      showLinkModal: false,
      showDataManager: false,
      editingGroup: null,
      editingLink: null,
      editingGroupId: null,
      nextGroupId: 3,
      nextLinkId: 6,
      currentBackground: 'bg-1',
      displayMode: 'mode-cover',
      searchQuery: '',
      currentTime: '',
      currentDate: '',
      searchEngine: 'baidu', // 'baidu' 或 'google'
      currentLayout: 'grid', // 当前布局模式
      layoutOptions: [
        {
          value: 'grid',
          name: '网格',
          icon: 'M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3'
        },
        {
          value: 'compact',
          name: '紧凑',
          icon: 'M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9'
        }
      ]
    }
  },
  computed: {
    totalLinks() {
      return this.linkGroups.reduce((total, group) => total + group.links.length, 0)
    },
    displayModeText() {
      const modes = {
        'mode-contain': '完整显示',
        'mode-cover': '填满屏幕',
        'mode-fit': '拉伸适应'
      }
      return modes[this.displayMode] || '完整显示'
    },
    filteredLinkGroups() {
      if (!this.searchQuery) {
        return this.linkGroups
      }
      const query = this.searchQuery.toLowerCase()
      return this.linkGroups.map(group => ({
        ...group,
        links: group.links.filter(link =>
          link.name.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query) ||
          link.description.toLowerCase().includes(query)
        )
      })).filter(group => group.links.length > 0)
    },
    searchPlaceholder() {
      const engineName = this.searchEngine === 'baidu' ? '百度' : 'Google'
      return `搜索书签或按回车用${engineName}搜索... (Ctrl+, 打开数据管理)`
    },
    searchEngineTitle() {
      return this.searchEngine === 'baidu' ? '当前：百度搜索，点击切换到Google' : '当前：Google搜索，点击切换到百度'
    }
  },
  mounted() {
    this.loadData()
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    // 分组相关方法
    addNewGroup() {
      this.editingGroup = null
      this.showAddGroupModal = true
    },

    editGroup(group) {
      this.editingGroup = { ...group }
      this.showEditGroupModal = true
    },
    
    deleteGroup(groupId) {
      if (confirm('确定要删除这个分组吗？')) {
        this.linkGroups = this.linkGroups.filter(g => g.id !== groupId)
        this.saveData()
      }
    },
    
    saveGroup(groupData) {
      if (groupData.id) {
        // 编辑现有分组
        const index = this.linkGroups.findIndex(g => g.id === groupData.id)
        if (index !== -1) {
          this.linkGroups[index] = { ...groupData }
        }
      } else {
        // 添加新分组
        const newGroup = {
          ...groupData,
          id: this.nextGroupId++,
          links: []
        }
        this.linkGroups.push(newGroup)
      }
      this.saveData()
      this.cancelGroupEdit()
    },
    
    cancelGroupEdit() {
      this.editingGroup = null
      this.showAddGroupModal = false
      this.showEditGroupModal = false
    },
    
    // 链接相关方法
    addLink(groupId) {
      this.editingGroupId = groupId
      this.editingLink = null
      this.showLinkModal = true
    },
    
    editLink(groupId, link) {
      this.editingGroupId = groupId
      this.editingLink = { ...link }
      this.showLinkModal = true
    },
    
    deleteLink(groupId, linkId) {
      if (confirm('确定要删除这个链接吗？')) {
        const group = this.linkGroups.find(g => g.id === groupId)
        if (group) {
          group.links = group.links.filter(l => l.id !== linkId)
          this.saveData()
        }
      }
    },
    
    saveLink(linkData) {
      const group = this.linkGroups.find(g => g.id === this.editingGroupId)
      if (!group) return
      
      if (linkData.id) {
        // 编辑现有链接
        const index = group.links.findIndex(l => l.id === linkData.id)
        if (index !== -1) {
          group.links[index] = { ...linkData }
        }
      } else {
        // 添加新链接
        const newLink = {
          ...linkData,
          id: this.nextLinkId++
        }
        group.links.push(newLink)
      }
      this.saveData()
      this.cancelLinkEdit()
    },
    
    cancelLinkEdit() {
      this.editingLink = null
      this.editingGroupId = null
      this.showLinkModal = false
    },
    
    // 数据持久化
    saveData() {
      localStorage.setItem('navData', JSON.stringify({
        linkGroups: this.linkGroups,
        nextGroupId: this.nextGroupId,
        nextLinkId: this.nextLinkId,
        currentBackground: this.currentBackground,
        displayMode: this.displayMode,
        searchEngine: this.searchEngine,
        currentLayout: this.currentLayout
      }))
    },
    
    loadData() {
      const savedData = localStorage.getItem('navData')
      if (savedData) {
        const data = JSON.parse(savedData)
        this.linkGroups = data.linkGroups || this.linkGroups
        this.nextGroupId = data.nextGroupId || this.nextGroupId
        this.nextLinkId = data.nextLinkId || this.nextLinkId
        this.currentBackground = data.currentBackground || this.currentBackground
        this.displayMode = data.displayMode || this.displayMode
        this.searchEngine = data.searchEngine || this.searchEngine
        this.currentLayout = data.currentLayout || this.currentLayout
      }
    },
    
    switchBackground() {
      const backgrounds = ['bg-1', 'bg-2', 'bg-3']
      const currentIndex = backgrounds.indexOf(this.currentBackground)
      const nextIndex = (currentIndex + 1) % backgrounds.length
      this.currentBackground = backgrounds[nextIndex]
      this.saveData()
    },
    
    switchDisplayMode() {
      const modes = ['mode-contain', 'mode-cover', 'mode-fit']
      const currentIndex = modes.indexOf(this.displayMode)
      const nextIndex = (currentIndex + 1) % modes.length
      this.displayMode = modes[nextIndex]
      this.saveData()
    },
    
    importData(importedData) {
      try {
        if (importedData.linkGroups && Array.isArray(importedData.linkGroups)) {
          // 更新ID以避免冲突
          importedData.linkGroups.forEach(group => {
            const originalGroupId = group.id
            group.id = this.nextGroupId++
            
            if (group.links && Array.isArray(group.links)) {
              group.links.forEach(link => {
                link.id = this.nextLinkId++
              })
            }
          })
          
          // 添加到现有分组
          this.linkGroups = [...this.linkGroups, ...importedData.linkGroups]
          this.saveData()
          this.showDataManager = false
          
          alert(`成功导入 ${importedData.linkGroups.length} 个分组！`)
        } else {
          throw new Error('导入数据格式不正确')
        }
      } catch (error) {
        alert('导入失败：' + error.message)
      }
    },

    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString()
      this.currentDate = now.toLocaleDateString()
    },

    handleSearch() {
      // 这里可以添加搜索逻辑，例如实时过滤 linkGroups
      // 例如：this.filteredLinkGroups = this.linkGroups.filter(group => {
      //   const groupMatches = group.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      //   if (groupMatches) return true
      //   return group.links.some(link => 
      //     link.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      //     link.url.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      //     link.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      //   )
      // })
    },

    handleKeydown(event) {
      // Ctrl+, 打开数据管理
      if (event.ctrlKey && event.key === ',') {
        event.preventDefault()
        this.showDataManager = true
      }
    },

    handleEnterSearch() {
      // 按回车键时，如果没有搜索结果，自动使用当前选择的搜索引擎
      if (this.searchQuery && this.filteredLinkGroups.length === 0) {
        this.performSearch()
      }
    },

    searchWithBaidu() {
      if (this.searchQuery.trim()) {
        const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(this.searchQuery.trim())}`
        window.open(searchUrl, '_blank')
      }
    },

    searchWithGoogle() {
      if (this.searchQuery.trim()) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(this.searchQuery.trim())}`
        window.open(searchUrl, '_blank')
      }
    },

    toggleSearchEngine() {
      this.searchEngine = this.searchEngine === 'baidu' ? 'google' : 'baidu'
      this.saveData()
    },

    performSearch() {
      if (this.searchEngine === 'baidu') {
        this.searchWithBaidu()
      } else {
        this.searchWithGoogle()
      }
    },

    // 布局切换
    switchLayout(layout) {
      this.currentLayout = layout
      this.saveData()
    }
  }
}
</script>