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
          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-button type="primary" @click="addField">添加字段</el-button>
              </el-col>
              <el-col :span="12">
                <el-checkbox v-model="dataConfig.listEnable">列表</el-checkbox>
                <el-checkbox v-model="dataConfig.addEnable">新增</el-checkbox>
                <el-checkbox v-model="dataConfig.editEnable">编辑</el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
          <draggable v-model="dataList">
            <transition-group>
              <el-form-item v-for="(data, index) in dataList" :key="index">
                <el-row :gutter="20">
                  <el-col :span="2">
                    <el-input v-model="data.key" placeholder="字段名"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-input v-model="data.name" placeholder="中文含义"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-select v-model="data.type" placeholder="类型">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox v-if="dataConfig.listEnable" v-model="data.read">可读</el-checkbox>
                    <el-checkbox v-if="dataConfig.addEnable || dataConfig.editEnable" v-model="data.write">可写</el-checkbox>
                  </el-col>
                  <el-col :span="5" v-if="data.type === 'number' || data.type === 'string'">
                    <el-tag
                      v-for="item in data.choices"
                      :key="item.label"
                      closable
                      type="">
                      {{item.label}}
                    </el-tag>
                  </el-col>
                  <template v-if="data.type === 'number' || data.type === 'string'">
                    <el-col :span="3">
                      <el-select v-model="data._select_type" placeholder="选择类型">
                        <el-option label="固定" value="fixed"></el-option>
                        <el-option label="接口" value="api"></el-option>
                      </el-select>
                    </el-col>
                    <template v-if="data._select_type === 'fixed'">
                      <el-col :span="3">
                        <el-input v-model="data._value" placeholder="值"></el-input>
                      </el-col>
                      <el-col :span="3">
                        <el-input v-model="data._label" placeholder="标签"></el-input>
                      </el-col>
                      <el-col :span="1">
                        <el-button type="primary" @click="addOption(index)">增加</el-button>
                      </el-col>
                    </template>
                    <template v-if="data._select_type === 'api'">
                      <el-col :span="3">
                        <el-input v-model="data._api_path" placeholder="接口地址"></el-input>
                      </el-col>
                      <el-col :span="2">
                        <el-input v-model="data._label" placeholder="标签"></el-input>
                      </el-col>
                      <el-col :span="2">
                        <el-input v-model="data._value" placeholder="内容"></el-input>
                      </el-col>
                    </template>
                  </template>
                </el-row>
              </el-form-item>
            </transition-group>
          </draggable>
          <el-form-item label="名称">
            <el-input v-model="dataConfig.name"></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="dataConfig.title"></el-input>
          </el-form-item>
          <el-form-item label="接口地址">
            <el-input v-model="dataConfig.url"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadJson">选择目录生成代码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import d2Curd from '../utils/d2Crud'
  import draggable from 'vuedraggable'
  const mysql = require('mysql')

  export default {
    components: {
      draggable
    },
    data () {
      return {
        config: null,
        connection: null,
        tables: [],
        currentTable: '',
        name: '',
        columns: [],
        dataConfig: {
          name: '',
          url: '',
          title: '',
          listEnable: true,
          editEnable: true,
          addEnable: true
        },
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
        this.currentTable = tableName
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
          this.dataList = this.boxDataList(rows)
          console.log('query', rows)
        })
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
          }
          return {
            key: key,
            name: row.Comment,
            type: type,
            read: true,
            write,
            choices: []
          }
        })
      },
      downloadJson () {
        const {dialog} = require('electron').remote
        const filePath = dialog.showOpenDialog({properties: ['openDirectory']})
        console.log('showSaveDialog', filePath)
        if (!filePath) {
          this.$message.error('请选择保存路径')
          return
        }
        // const filterDataList = this.dataList.map(data => {
        //   const keys = Object.keys(data).filter(key => !key.startsWith('_'))
        //   const newData = {}
        //   keys.forEach(key => { newData[key] = data[key] })
        //   return newData
        // })
        console.log('filterDataList', this.dataList)
        d2Curd(filePath[0], this.dataConfig, this.dataList)
      },
      addOption (index) {
        const data = this.dataList[index]
        data.choices.push({value: data._value, label: data._label})
        this.dataList[index] = data
      },
      handleSelectClose (data, index) {
        data.choices.splice(index, 1)
      },
      addField () {
        this.dataList.push({
          key: '',
          name: '',
          type: '',
          read: true,
          write: true,
          choices: []
        })
      }
    }
  }
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
