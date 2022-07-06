###前端下载：<a>标签的download属性
此属性指示浏览器下载URL而不是导航到它，因此将提示用户将其保存为本地文件。如果属性有一个值，那么它将作为下载的文件名使用。此属性对允许的值没有限制，但是/和\会被转换为下划线。
- 此属性仅适用于同源 URLs。
- 尽管HTTP URL需要位于同一源中，但是可以使用 blob: URLs 和 data: URLs ，以方便用户下载 JavaScript 方式生成的内容（例如使用在线绘图的Web应用创建的照片）。

###生成并下载字符串文件
######Blob数据
Blob(Binary Large Object，二进制类型的大对象)，表示一个不可变的原始数据的类文件对象，我们上传文件时常用的File对象就继承于Blob，并进行了扩展用于支持用户系统上的文件。

通过Blob()构造函数来创建一个新的Blob对象
```
// 创建一个json类型的Blob对象，支持传入同类型数据的一个数组
var debug = {hello: "world"};
var blob = new Blob([JSON.stringify(debug, null, 2)],
  {type : 'application/json'});

// 此时blob的值
// Blob(22) {size: 22, type: 'application/json'}
```

######URL对象和下载字符串文件
URL 接口是一个用来创建 URLs 的对象，包含两个静态方法
- objectURL = URL.createObjectURL(blob)
- URL.revokeObjectURL(objectURL)
```
var url = URL.createObjectURL(blob);
// 此时url的值，跟document绑定，所以每个页面创建的字符串均不同
// blob:https://developer.mozilla.org/defe53c2-2882-43c6-b275-db2a57959789
```
此时，我们在页面中创建一个新<a>标签，点击即可下载我们想要的文件
```
<a href="blob:https://developer.mozilla.org/58702010-433d-4097-990f-e483d84cd02a" download="file.json">下载文件链接</a>
```

######FileReader读取Blob数据
FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

其中File对象可以是来自用户在一个<input>元素上选择文件后返回的FileList对象,也可以来自拖放操作生成的 DataTransfer对象,还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果。（详细属性查询文末原文链接）

我们可以直接读取Blob对象的数据：
```
var reader = new FileReader();
reader.addEventListener("loadend", function() {
   console.log(reader.result);
});
reader.readAsDataURL(blob);
// 此时result的值
// data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ==
reader.readAsText(blob);
// 此时result的值
// {
//     "hello": "world"
// }
```

###下载图片
除了浏览器自带的右键保存，我们还可以这么做来下载图片：
```
// 通过src获取图片的blob对象
function getImageBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
        if (this.status == 200) {
            cb(this.response);
        }
    };
    xhr.send();
}

let reader = new FileReader();
reader.addEventListener("loadend", function() {
   console.log(reader.result);
});
getImageBlob('https://cdn.segmentfault.com/v-5c4ec07f/global/img/user-64.png', function(blob){
    // 读取来看下下载的内容
    reader.readAsDataURL(blob);
    // 最终生成的字符串
    // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAA...
    // 生成下载用的URL对象
    let url = URL.createObjectURL(blob);
    // 生成一个a标签，并模拟点击，即可下载，批量下载同理
    let aDom = aDom = document.createElement('a');
    aDom.href = url;
    aDom.download = 'download.json';
    aDom.text = '下载文件';
    document.getElementsByTagName('body')[0].appendChild(aDom);
    aDom.click();
});
```
###下载excel文件
```
// 引入CDN文件
'https://cdn.bootcss.com/xlsx/0.14.1/xlsx.core.min.js',
'https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js',
'https://cdn.bootcss.com/TableExport/5.2.0/js/tableexport.min.js'

// 绑定下载事件，这个是我自己的场景下代码，可能不适合大家，具体的参考官方文档
const tableDom = $('#table');
$('.table-exportBtn', tableDom).on('click', function () {
    const tableExport = tableDom.tableExport({
        formats: ['xlsx', 'txt'],
        filename: '表格下载',
        exportButtons: false
    });
    const type = $(this).data().type;
    const exportData = tableExport.getExportData()[tableDom[0].id][type];
    const {data, mimeType, filename, fileExtension, merges, RTL, sheetname} = exportData;
    // 源码里才能看到完整参数，官方文档没有写全，导致下载的文件格式错误
    tableExport.export2file(data, mimeType, filename, fileExtension, merges, RTL, sheetname);
});
```
###第三方库实现
[https://github.com/rndme/download](https://github.com/rndme/download)
> 原文链接：[前端js实现字符串/图片/excel文件下载](https://segmentfault.com/a/1190000018143902)
