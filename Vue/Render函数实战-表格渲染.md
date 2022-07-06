<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:58:34
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/Vue/Render函数实战-表格渲染.md
-->

直接贴代码，具体内容看代码内注释
###index.html

```
<!DOCTYPE html>
<html lang="zh">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>可排序的表格</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <div id="app" v-cloak>
    <v-table :data="data" :columns="columns"></v-table>
    <button @click="handleAddData">添加数据</button>
  </div>
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>
  <script src="table.js"></script>
  <script src="index.js"></script>
</body>

</html>
```

###style.css

```
[v-cloak] {
  display: none;
}

table {
  width: 100%;
  margin-bottom: 24px;
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  border: 1px solid #e9e9e9;
}

table th {
  background: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
  white-space: nowrap;
}

table td,
table th {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
}

table th a {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
}

table th a:on {
  color: #3399ff;
}

table th a:hover {
  color: #3399ff;
}
```

###index.js 主要钩子函数

```
var app = new Vue({
  el: "#app",
  data: {
    columns: [{
      title: "姓名",
      key: "name"
    }, {
      title: "年龄",
      key: "age",
      sortable: true
    }, {
      title: "出生日期",
      key: "birthday",
      sortable: true
    }, {
      title: "地址",
      key: "address"
    }],
    data: [{
      name: "王小明",
      age: 18,
      birthday: "1999-02-21",
      address: "北京市朝阳区芍药居"
    }, {
      name: "张小刚",
      age: 25,
      birthday: "1992-01-23",
      address: "北京市朝阳区芍药居"
    }, {
      name: "李小红",
      age: 30,
      birthday: "1987-11-10",
      address: "北京市朝阳区芍药居"
    }, {
      name: "周小伟",
      age: 26,
      birthday: "1991-10-10",
      address: "北京市朝阳区芍药居"
    }]
  },
  methods: {
    handleAddData() {
      this.data.push({
        name: "刘小天",
        age: 19,
        birthday: "1998-05-30",
        address: "北京市东城区东直门"
      })
    }
  },
})
```

###table.js

```
Vue.component("vTable", {
  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 为了避免传入数据污染创建当前组件的数据
      currentColumns: [],
      currentData: []
    }
  },
  methods: {
    // 为表头添加索引以及当前的排序状态
    makeColumns() {
      this.currentColumns = this.columns.map((col, index) => {
        col._sortType = "normal"
        col._index = index
        return col
      })
    },
    // 为数据添加索引用于排序
    makeData() {
      this.currentData = this.data.map((row, index) => {
        row._index = index
        return row
      })
    },
    // 升序
    handleSortByAsc(index) {
      var key = this.currentColumns[index].key
      this.currentColumns.forEach(col => {
        col._sortType = "normal"
      })
      this.currentColumns[index]._sortType = "asc"

      this.currentData.sort((a, b) => {
        return a[key] > b[key] ? 1 : -1
      })
    },
    // 降序
    handleSortByDesc(index) {
      var key = this.currentColumns[index].key
      this.currentColumns.forEach(col => {
        col._sortType = "normal"
      })
      this.currentColumns[index]._sortType = "desc"

      this.currentData.sort((a, b) => {
        return a[key] < b[key] ? 1 : -1
      })
    }
  },
  watch: {
    // 父级数据改变 对应的改变子组件的数据 并重新排列
    data() {
      this.makeData()
      var sortedColumn = this.currentColumns.filter(col => {
        return col._sortType !== "normal"
      })

      if (sortedColumn.length > 0) {
        if (sortedColumn[0]._sortType === "asc") {
          this.handleSortByAsc(sortedColumn[0]._index)
        } else {
          this.handleSortByDesc(sortedColumn[0]._index)
        }
      }
    }
  },
  mounted() {
    this.makeColumns()
    this.makeData()
  },
  render(h) {
    var _this = this
    var ths = []
    this.currentColumns.forEach((col, index) => {
      // 判断字段是否可以排序
      if (col.sortable) {
        ths.push(h("th", [
          h("span", col.title),
          h("a", {
            class: {
              on: col._sortType === "asc"
            },
            on: {
              click: () => {
                _this.handleSortByAsc(index)
              }
            }
          }, "↑"),
          h("a", {
            class: {
              on: col._sortType === "desc"
            },
            on: {
              click: () => {
                _this.handleSortByDesc(index)
              }
            }
          }, "↓")
        ]))
      } else {
        ths.push(h("th", col.title))
      }
    })
    var trs = []
    this.currentData.forEach((row) => {
      var tds = []
      _this.currentColumns.forEach(cell => {
        tds.push(h("td", row[cell.key]))
      })
      trs.push(h("tr", tds))
    })
    return h('table', [
      h("thead", [
        h("tr", ths)
      ]),
      h("tbody", trs)
    ])
  },
})
```

> 代码原文：《Vue.js 实战》-- 梁灏
> github 地址：[https://github.com/alanwhy/vue_render](https://github.com/alanwhy/vue_render)
