<template>
  <el-container>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1']">
        <el-submenu index="1">
          <template slot="title">表格</template>
          <el-menu-item v-for="(table, index) in tables" :key="index" :index="`1-${index}`" @click="showTableSchema(table)">{{ table }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item v-for="data in dataList" :key="data.key" :label="data.key">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input v-model="data.name" placeholder="中文含义"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select v-model="data.type" placeholder="类型">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-checkbox v-model="data.read">可读</el-checkbox>
                <el-checkbox v-model="data.write">可写</el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadJson">下载JSON文件</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="columns"
          style="width: 100%">
          <el-table-column
            prop="Field"
            label="字段"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Type"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Null"
            label="可空">
          </el-table-column>
          <el-table-column
            prop="Comment"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="Default"
            label="默认">
          </el-table-column>
        </el-table>  
      </div>
    </el-main>
  </el-container>
</template>
<script>
  const mysql = require('mysql')
  export default {
    data () {
      return {
        config: null,
        connection: null,
        tables: [],
        columns: [],
        dataList: [],
        typeOptions: [
          {value: 'string', label: '字符'},
          {value: 'text', label: '文本'},
          {value: 'number', label: '数字'},
          {value: 'datetime', label: '日期'},
          {value: 'boolean', label: '布尔'},
          {value: 'image', label: '图片'},
          {value: 'file', label: '文件'}
        ]
      }
    },
    created () {
      const configStr = localStorage.getItem('config')
      this.config = JSON.parse(configStr)
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
          this.connection = connection
          localStorage.setItem('config', JSON.stringify(this.config))
          this.$router.push({ name: 'main-page' })
          this.getTables()
        }
      })
    },
    methods: {
      getTables () {
        const query = 'show tables;'
        this.connection.query(query, (err, rows, fields) => {
          if (err) {
            console.log(err.code)
            console.log(err.fatal)
            this.$message.error(`连接错误。错误码：${err.code}`)
          }
          this.tables = rows.map(row => row[`Tables_in_${this.config.database}`])
          console.log('query', rows)
        })
      },
      showTableSchema (tableName) {
        const query = `show full columns from ${tableName};`
        this.connection.query(query, (err, rows, fields) => {
          if (err) {
            console.log(err.code)
            console.log(err.fatal)
            this.$message.error(`连接错误。错误码：${err.code}`)
          }
          this.columns = rows
          this.dataList = this.boxDataList(rows)
          console.log('query', rows)
        })
      },
      boxDataList (rows) {
        return rows.map(row => {
          const key = row.Field
          const rowType = row.Type
          let read = key !== 'id'
          let type = 'string'
          if (rowType.startsWith('int')) {
            type = 'number'
          } else if (rowType.startsWith('timestamp')) {
            type = 'datetime'
          } else if (rowType.startsWith('timestamp')) {
          }
          return {
            key: key,
            name: row.Comment,
            type: type,
            read: read,
            write: true
          }
        })
      },
      downloadJson () {
      }
    }
  }
</script>
<style>

</style>
