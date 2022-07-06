```
$.ajax({
  type: 'GET',
  // httpproxy.jsp解决跨域问题
  url: './httpproxy.jsp?url=' + 'http://127.0.0.1:8080/dfc/services/sgssfs/2429',// 此处为DM保存原始地址
  // mule代理地址（需要解决跨域问题）
  // http://127.0.0.1:8081/geoesb/proxy/d8bf2c050e3d4428800004f7a4868f01/886e60bb7e014f22a707de23e6f6505d
  data: {
    request: "GETFEATURE", // wfs服务和sfs必须的请求参数方式，即获取图层 必要参数
    filter: "SMID > 0", // 过滤器 将字段中SMID>0（即全部数据）查询出来 必要参数
    page: 1, // 分页参数
    rp: 10 // 分页参数 每一页展示的条数
  },
  success: function(res) {
    console.log("success");
  }
});
```
