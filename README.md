# op-scaffold

> 代码生成工具

## Context

代码生成器上下文信息为代码生成过程中，目标项目`.op/doRender.js`接收到的参数，通过这些参数来进行代码生成

### sourceDir

项目目录，例如：`/Users/bohan/Work/Tmp/op-d2-start-kit`

### dataConfig

配置信息，例如：

```json
{
  "name": "voice_tipoff",
  "url": "/api/admin/voice_tipoff/",
  "title": "voice_tipoff",
  "listEnable": true,
  "editEnable": true,
  "addEnable": true,
  "searchEnable": false
}
```

- name: 生成代码的目录名称
- url: 接口地址
- title: 中文标题
- listEnable: 是否有列表
- editEnable: 是否有编辑
- addEnable: 是否有新增
- searchEnable: 是否有搜索

### fields

字段信息，例如：

```json
[
    {
        "key": "id",
        "name": "",
        "type": "number",
        "read": true,
        "write": false,
        "require": true,
        "choices": []
    },
    {
        "key": "updated_at",
        "name": "",
        "type": "datetime",
        "read": true,
        "write": true,
        "require": true,
        "choices": []
    },
    ...
]
```

- key: 字段名
- name: 中文含义
- type: 类型
  - string: 字符类型
  - text: 文本类型
  - number: 数字类型
  - datetime: 日期类型
  - boolean: 布尔类型
  - image: 图片类型
  - file: 文件类型
  - content: 富文本类型
- read: 是否可读
- write: 是否可写
- require: 是否必填
- choices: 选项。当类型为字符类型时可添加选项，目前支持两种格式
  - 键值对形式
  - 接口获取

### searchList

搜索字段列表，例如：

```json
[
    {
        "key": "test",
        "name": "测试",
        "type": "string",
        "choices": []
    },
    ...
]
```

- key: 字段名
- name: 中文含义
- type: 类型
  - string: 字符类型
  - datetime: 日期类型
- choices: 选项。当类型为字符类型时可添加选项，目前支持两种格式
  - 键值对形式
  - 接口获取

## How to start

``` bash
git clone https://github.com/one-programmer/op-d2-start-kit.git
cd op-d2-start-kit
npm install
```

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[80dc2ec](https://github.com/SimulatedGREG/electron-vue/tree/80dc2ece3425c558bfb2efbd57c3071e1b71be6d) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
