<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:58:31
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/Vue/element-ui修改表头及每行的样式（不使用border属性）.md
-->
标签代码：

```
        <el-table :data="tabledata" :header-cell-style="rowClass" :cell-style="cellStyle" height="13.65em">
          <el-table-column prop="level" label="级别"></el-table-column>
          <el-table-column prop="name" label="景点名称"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="introduction" label="简介"></el-table-column>
        </el-table>
```

通过 methods 中的方法返回样式：

```
  methods: {
    rowClass() {
      return 'background: #fff;color: #909399;font-weight: 600;border-right: 1px solid #ebeef5'
    },
    cellStyle() {
      return 'border-right: 1px solid #ebeef5'
    }
  }
```

样式效果图：
![样式效果图.png](https://upload-images.jianshu.io/upload_images/12877063-1943e3655e117bbf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
