<template>
  <div>
    <el-container>
      <el-aside class="asideBlock">
        <div class="projectBlock" v-for="recentProject in recentProjects" :key="recentProject.id" @click="doOpen(recentProject)">
          <div class="dirNameBlock">{{ recentProject.dirName }}</div>
          <div class="locationBlock">{{ recentProject.path }}</div>
        </div>

      </el-aside>
      <el-main class="mainBlock">
        <div class="actionBlock">
          <div>
            <el-button type="primary" @click="openProject">打开</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>  
</template>
<script>
import db from '../utils/db'
const uuidv4 = require('uuid/v4')

export default {
  data () {
    return {
      recentProjects: db.get('projects').take(10).value()
    }
  },
  methods: {
    openProject () {
      const { dialog } = require('electron').remote
      const location = dialog.showOpenDialog({properties: ['openDirectory']})
      console.log('showSaveDialog', location)
      if (!location) {
        this.$message.error('请选择打开路径')
        return
      }
      const path = location[0]
      const projects = db.get('projects')
      let project = projects.find({ path }).value()
      if (!project) {
        const dirName = path.substring(path.lastIndexOf('/') + 1)
        project = { path, dirName, id: uuidv4() }
        projects.push(project).write()
      }
      this.doOpen(project)
    },
    doOpen (project) {
      this.$router.push({name: 'landing-page', query: { projectId: project.id }})
    }
  }
}
</script>

<style scoped>
  .asideBlock {
    width: 30%;
    margin: 0 20px;
  }
  .projectBlock {
    padding: 5px;
  }
  .projectBlock:hover {
    background-color: #409EFF;
    color: white;
  }
  .dirNameBlock {
    padding: 5px;
  }
  .locationBlock {
    color: #909399;
  }
  .mainBlock {
    background-color: #DCDFE6;
  }
</style>

