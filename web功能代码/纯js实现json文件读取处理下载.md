### 需求分析

用户上传 json 文件，客户端进行处理解析后，返回进行下载

### 技术选型

基于本身的项目采用了 `vue` + `elementUI` 的前端框架开发，使用 `FileReader` 和 `file-saver` 进行数据的读取和写入

### 具体实现

##### 1.模板部分

```
<template>
  <div class="style-2to3">
    <el-card class="box-card">
      <div class="container">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          action="/file/upload"
          accept=".json"
          :limit="1"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将JSON文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </div>
    </el-card>
  </div>
</template>
```

##### 2.上传后 input 状态修改监听

写在 mounted 中，直接初始化

```
mounted() {
    const input = document.querySelector('input[type=file]');
    input.addEventListener(
      'change',
      () => {
        if (input.files && input.files.length) {
          const reader = new FileReader();
          reader.readAsText(input.files[0], 'utf8'); // input.files[0]为第一个文件
          reader.onload = () => {
            // reader.result 就是文件内容
            console.log(JSON.stringify(JSON.parse(reader.result)))
          };
        }
      },
      false
    );
  },
```

##### 3.处理后的 json 数据，进行下载保存

采用插件 [file-saver](https://www.npmjs.com/package/file-saver) 进行保存

```
import FileSaver from 'file-saver';

...

saveAs() {
  let name = `transJson_${new Date().getTime()}.json`;
  var file = new File([JSON.stringify(JSON.parse(reader.result))], name, {
    type: 'text/plain;charset=utf-8',
  });
  FileSaver.saveAs(file);
},
```
