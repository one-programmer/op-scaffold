<template>
  <el-container>
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
  </el-container>
</template>
<script>
  const mysql = require('mysql')
  export default {
    name: 'landing-page',
    components: { },
    data () {
      return {
        connection: null,
        config: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: '', // or the original password : 'apaswword'
          database: ''
        }
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
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
            this.$router.push({ name: 'main-page' })
          }
        })
      }
    }
  }
</script>

<style>
</style>
