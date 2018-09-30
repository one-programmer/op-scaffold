<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title">快速选择</template>
            <el-menu-item v-if="histories.length" v-for="(table, index) in histories" :key="index" :index="`1-${index}`" @click="showTableSchema(table)">{{ table }}</el-menu-item>
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
          <el-tab-pane label="JSON文件" name="JSON">
            <el-upload
              class="upload-demo"
              drag
              accept="application/json"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-success="jsonUpload"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传json文件</div>
            </el-upload>
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
        <li v-for="item in tables" @click="showDB(item)">{{item}}</li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
  const fs = require('fs')
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
        histories: []
      }
    },
    created () {
      this.config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : this.config
      if (fs.existsSync(path.join(__static, `newSheet/`))) {
        this.histories = fs.readdirSync(path.join(__static, `newSheet/`))
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      tabClick (item) {
        if (item.index === '2') {
          this.$router.push({name: 'main-page', query: {type: 2}})
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
      showTableSchema (tabel) {
        let data = fs.readFileSync(path.join(__static, `newSheet/`, `${tabel}`), 'utf8')
        this.$router.push({name: 'main-page', query: {type: 3, data: data}})
      },
      showDB (item) {
        this.$router.push({name: 'main-page', query: {type: 0, tableName: item}})
      },
      jsonUpload (res, file) {
        let data = fs.readFileSync(file.raw.path, 'utf8')
        this.$router.push({name: 'main-page', query: {type: 1, data: data}})
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
</style>
