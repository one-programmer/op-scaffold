<template>
  <el-container>
    <el-main style="padding-left:0">
        <el-form ref="form" label-width="60px">
          <el-form-item>
            <el-button type="primary" @click="addField">添加字段</el-button>
          </el-form-item>
          <draggable v-model="searchList">
            <transition-group>
              <el-form-item v-for="(data, index) in searchList" :key="index">
                <el-row :gutter="20">
                  <el-col :span="2">
                    <i class="el-icon-close" @click="deleteDataItem(index)"></i>
                  </el-col>
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
                  <el-col :span="5" v-if="data.type === 'string'">
                    <el-tag
                      v-for="(item, index) in data.choices"
                      :key="item.label"
                      closable
                      type=""
                      @close="handleSelectClose(data, index)">
                      {{item.label}}
                    </el-tag>
                  </el-col>
                  <template v-if="data.type === 'string'">
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
        </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
    components: {
      draggable
    },
    data () {
      return {
        search: {},
        searchList: [],
        typeOptions: [
          {value: 'string', label: '字符'},
          {value: 'datetime', label: '日期'}
        ]
      }
    },
    created () {
    },
    updated () {
      this.$emit('change', this.searchList)
    },
    methods: {
      addOption (index) {
        const data = this.searchList[index]
        data.choices.push({value: data._value, label: data._label})
        this.searchList[index] = data
        data._value = ''
        data._label = ''
      },
      handleSelectClose (data, index) {
        data.choices.splice(index, 1)
      },
      deleteDataItem (index) {
        this.searchList.splice(index, 1)
      },
      addField () {
        this.searchList.push({
          key: '',
          name: '',
          type: '',
          choices: []
        })
      }
    }
  }
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
