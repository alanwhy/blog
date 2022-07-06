<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:58:08
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/SuperMap/SuperMap-for-leaflet加载ogc-wms平面服务.md
-->
在线运行地址：[http://iclient.supermap.io/examples/leaflet/editor.html#WMSLayer](http://iclient.supermap.io/examples/leaflet/editor.html#WMSLayer)

复制如下代码到编辑器 更换对应的参数 运行

```
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title data-i18n="resources.title_wms"></title>
  <script type="text/javascript" src="../js/include-web.js"></script>
</head>

<body style=" margin: 0;overflow: hidden;background: #fff;width: 100%;height:100%;position: absolute;top: 0;">
  <div id="map" style="margin:0 auto;width: 100%;height: 100%"></div>
  <script type="text/javascript" src="../../dist/leaflet/include-leaflet.js"></script>
  <script type="text/javascript">
    var host = window.isLocal ? window.server : "http://support.supermap.com.cn:8090";
    Proj4js.defs("EPSG:4548",
      "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs ");
    var crs = L.Proj.CRS('EPSG:4548', {
      origin: [452178.4, 4442698.84],
      bounds: L.bounds([452178.4, 4440716.6], [455048.16, 4442698.84])
    })
    var map = L.map('map', {
      crs: crs,
      center: [40.11, 116.46],
      maxZoom: 18,
      zoom: 1
    });
    L.tileLayer.wms("http://XXX.XXX.XX.XX:8090/iserver/services/map-WeiLaiCheng/wms111/weilaicheng", {
      layers: 'weilaicheng',
      format: 'image/png',
      transparent: true,
      noWrap: true,
      attribution: "Map Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span>"
    }).addTo(map);
  </script>
</body>

</html>
```
