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
    <header class="header">
      <div class="container">
        <div class="header-info">
          <div class="brand-logo">
            <svg class="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
              <path d="M12 16L20 24L28 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="12" r="2" fill="white"/>
              <circle cx="14" cy="28" r="1.5" fill="white" opacity="0.8"/>
              <circle cx="26" cy="28" r="1.5" fill="white" opacity="0.8"/>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
            <div class="brand-text">
              <h1 class="title">NavHub</h1>
              <p class="subtitle">智能导航中心</p>
            </div>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span>📁</span>
            <span>{{ linkGroups.length }} 个分组</span>
          </div>
          <div class="stat-item">
            <span>🔗</span>
            <span>{{ totalLinks }} 个链接</span>
          </div>
          <!-- <div class="stat-item">
            <button @click="switchBackground" class="bg-switch-btn">
              <span>🖼️</span>
              <span>切换背景</span>
            </button>
          </div>
          <div class="stat-item">
            <button @click="switchDisplayMode" class="bg-switch-btn">
              <span>📐</span>
              <span>{{ displayModeText }}</span>
            </button>
          </div> -->
          <div class="stat-item">
            <button @click="showDataManager = true" class="bg-switch-btn">
              <span>💾</span>
              <span>数据管理</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="main">
      <div class="container">
        <NavGroup 
          v-for="group in linkGroups" 
          :key="group.id"
          :group="group"
          @edit-group="editGroup"
          @delete-group="deleteGroup"
          @add-link="addLink"
          @edit-link="editLink"
          @delete-link="deleteLink"
        />
        
        <div class="add-group-card" @click="showAddGroupModal = true">
          <button class="add-group-btn">
            <div class="add-icon">+</div>
            <span>添加新分组</span>
          </button>
        </div>
      </div>
    </main>

    <!-- 添加分组模态框 -->
    <Modal v-if="showAddGroupModal" @close="showAddGroupModal = false">
      <GroupForm 
        :group="editingGroup"
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
      displayMode: 'mode-cover'
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
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 分组相关方法
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
    }
  }
}
</script>