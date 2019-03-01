<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">快速选择</template>
            <div v-if="histories.length > 0">
              <el-menu-item  v-for="(item, index) in histories" :key="index" :index="`1-${index}`" @click="goById(item.id)">{{ item.dataConfig.name }}
                <i class="el-icon-close" @click.stop="deleteById(item.id)"></i>
              </el-menu-item>
            </div>
            <el-menu-item v-if="!histories.length" :key="0" :index="`1-0`" >暂无记录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-tabs class="tabs" v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="数据库" name="DB">
            <el-main>
              <el-form :model="config" ref="config" label-width="100px">
                <el-form-item label="Host" prop="host">
                  <el-input v-model="config.host"></el-input>
                </el-form-item>
                <el-form-item label="Port" prop="port">
                  <el-input v-model="config.port"></el-input>
                </el-form-item>
                <el-form-item label="User" prop="user">
                  <el-input v-model="config.user"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                  <el-input type="password" v-model="config.password"></el-input>
                </el-form-item>
                <el-form-item label="Database" prop="database">
                  <el-input v-model="config.database"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="doConnection">连接</el-button>
                </el-form-item>
              </el-form>
            </el-main>
          </el-tab-pane>
          <el-tab-pane label="新建" name="NEW"></el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-dialog
      title="请选择想要操作的数据表"
      :visible.sync="dialogVisible"
      width="30%">
      <ul class="table-box">
        <li v-for="item in tables" :key="item" @click="goByTable(item)">{{item}}</li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
  import db from '../utils/db'
  import { getDataFromFilePath } from '../utils'

  const path = require('path')

  const mysql = require('mysql')
  export default {
    name: 'landing-page',
    data () {
      return {
        tables: [],
        activeName: 'DB',
        dialogVisible: false,
        connection: null,
        config: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: '', // or the original password : 'apaswword'
          database: ''
        },
        urlData: {},
        urlFileList: [],
        histories: [],
        dataConfig: {
          name: '',
          url: '',
          title: '',
          listEnable: true,
          editEnable: true,
          addEnable: true,
          searchEnable: false
        },
        projectId: null,
        project: null
      }
    },
    created () {
      this.projectId = this.$route.query.projectId
      this.project = db.get('projects').getById(this.projectId).value()
      this.config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : this.config
      this.histories = db.get('histories').filter({projectId: this.projectId}).take(20).value()
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      deleteById (itemId) {
        db.get('histories').remove({id: itemId}).write()
        this.histories = db.get('histories').filter({projectId: this.projectId}).take(20).value()
      },
      tabClick (tab) {
        if (tab.index === '1') {
          const dataList = []
          const projectConfig = getDataFromFilePath(path.join(this.project.path, '.op/projectConfig.json'))
          const item = db.get('histories').insert({ dataConfig: this.dataConfig, projectConfig, projectId: this.projectId, dataList }).write()
          this.goById(item.id)
        }
      },
      doConnection () {
        const connection = mysql.createConnection(this.config)
        // connect to mysql
        connection.connect((err) => {
          // in case of error
          if (err) {
            console.log(err.code)
            console.log(err.fatal)
            this.$message.error(`连接错误。错误码：${err.code}`)
          } else {
            console.log('connection sucess')
            this.$message('连接成功')
            this.connection = connection
            localStorage.setItem('config', JSON.stringify(this.config))
            // this.$router.push({name: 'main-page', query: {type: 0}})
            this.getTables()
          }
        })
      },
      getTables () {
        const query = 'show tables;'
        this.connection.query(query, (err, rows, fields) => {
          if (err) {
            console.log(err.code)
            console.log(err.fatal)
            this.$message.error(`连接错误。错误码：${err.code}`)
          }
          this.tables = rows.map(row => row[`Tables_in_${this.config.database}`])
          this.dialogVisible = true
        })
      },
      goById (itemId) {
        this.$router.push({name: 'main-page', query: { itemId, projectId: this.projectId }})
      },
      boxDataList (rows) {
        return rows.map(row => {
          const key = row.Field
          const rowType = row.Type
          let write = row.Key !== 'PRI'
          let type = 'string'
          if (rowType.startsWith('int') || rowType.startsWith('bigint')) {
            type = 'number'
          } else if (rowType.startsWith('timestamp') || rowType.startsWith('datetime')) {
            type = 'datetime'
          } else if (rowType.startsWith('tinyint')) {
            type = 'boolean'
          }
          return {
            key: key,
            name: row.Comment,
            type: type,
            read: true,
            write,
            require: true,
            choices: []
          }
        })
      },
      goByTable (tableName) {
        this.dataConfig.name = tableName
        this.dataConfig.title = tableName
        this.dataConfig.url = `/api/admin/${tableName}/`
        const query = `show full columns from ${tableName};`
        this.connection.query(query, (err, rows, fields) => {
          if (err) {
            console.log(err.code)
            console.log(err.fatal)
            this.$message.error(`连接错误。错误码：${err.code}`)
          }
          this.columns = rows
          const dataList = this.boxDataList(rows)

          const projectConfig = getDataFromFilePath(path.join(this.project.path, '.op/projectConfig.json'))
          const item = db.get('histories').insert({ dataConfig: this.dataConfig, projectConfig, projectId: this.projectId, dataList }).write()
          this.goById(item.id)
        })
      }
    }
  }
</script>

<style scoped>
  .table-box{
    list-style: none;
    font-size: 16px;
    line-height: 30px;
  }
  .el-icon-close{
    position: absolute;
    right: 0;
    padding: 15px;
    cursor: pointer;
    z-index: 10;
  }
</style>
