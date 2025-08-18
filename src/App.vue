<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-info">
          <h1 class="title">我的导航首页</h1>
          <p class="subtitle">快速访问常用链接</p>
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
  </div>
</template>

<script>
import NavGroup from './components/NavGroup.vue'
import Modal from './components/Modal.vue'
import GroupForm from './components/GroupForm.vue'
import LinkForm from './components/LinkForm.vue'

export default {
  name: 'App',
  components: {
    NavGroup,
    Modal,
    GroupForm,
    LinkForm
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
      editingGroup: null,
      editingLink: null,
      editingGroupId: null,
      nextGroupId: 3,
      nextLinkId: 6
    }
  },
  computed: {
    totalLinks() {
      return this.linkGroups.reduce((total, group) => total + group.links.length, 0)
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
        nextLinkId: this.nextLinkId
      }))
    },
    
    loadData() {
      const savedData = localStorage.getItem('navData')
      if (savedData) {
        const data = JSON.parse(savedData)
        this.linkGroups = data.linkGroups || this.linkGroups
        this.nextGroupId = data.nextGroupId || this.nextGroupId
        this.nextLinkId = data.nextLinkId || this.nextLinkId
      }
    }
  }
}
</script>