<template>
  <div id="app">
    <!-- 全屏风景背景 -->
    <div :class="`background-animation ${currentBackground} ${displayMode}`">
      <!-- 轻微粒子效果 -->
      <div class="particles">
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
        
        <!-- 右侧搜索区域 -->
        <div class="search-section">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索... (Ctrl+, 打开数据管理)" 
              class="search-input"
              @input="handleSearch"
              @keydown="handleKeydown"
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
        <div class="apps-grid">
          <NavGroup 
            v-for="group in filteredLinkGroups" 
            :key="group.id"
            :group="group"
            @edit-group="editGroup"
            @delete-group="deleteGroup"
            @add-link="addLink"
            @edit-link="editLink"
            @delete-link="deleteLink"
          />
          
          <div class="add-group-card" @click="addNewGroup">
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
      currentDate: ''
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
        displayMode: this.displayMode
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
    }
  }
}
</script>