> 参考链接：[聊聊 GIS 中那些坐标系](https://www.cnblogs.com/onsummer/p/7451128.html)、[百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和 WGS84 坐标系互转](https://cnodejs.org/topic/564c0a27e4766d487f6fe38d) ##前言：GIS 跟几何关系十分密切，能有丰富的空间想象能力，将有助你更好的理解接下来的知识~ # 一、经纬度和地理坐标系（GCS）
>
> ### 1、地球

- 为了能让地球出现在数学家的公式里，我们曾经走过了 2 个阶段：用平静的海面描述地球——用虚拟的旋转椭球面描述地球表面。
- “假设地球表面都是水，当海平面风平浪静没有波澜起伏时，这个面就是大地水准面。”
- 注意区分椭球面和旋转椭球面这两个数学概念，在 GCS 中都是旋转椭球面
- 旋转椭球面的标准方程：(x2+y2)/a2+z2/b2=1
- 由此我们可以下定义，GIS 坐标系中的椭球，如果加上高程系，在其内涵上就是 GCS（地理坐标系统）。其度量单位就是度分秒。

### 2、参心坐标系、地心坐标系

- 物体均有其质心，处处密度相等的物体的质心在其几何中心
- 由地球的唯一性和客观存在，以地球质心为旋转椭球面的中心的坐标系，叫地心坐标系（协议地球坐标系）
- GPS 中的坐标系叫瞬时地球坐标系
- 人为的把地球的质心“移走”，将局部的表面“贴到”该国的国土，使之高程误差尽量减小到最小。就出现了所谓的“参心坐标系”。即椭球中心不在地球质心的坐标系。
- 我国常用的参心系及对应椭球
  > 北京 54 坐标系：克拉索夫斯基椭球体
  > 西安 80 坐标系：IAG75 椭球体
- 我国常用的地心系及对应椭球：
  > WGS84 坐标系：WGS84 椭球体（GPS 星历的坐标系，全球统一使用，最新版于 2002 年修正）
  > CGCS2000 坐标系：CGCS2000 椭球体（事实上，CGCS2000 椭球和 WGS84 椭球极为相似，偏差仅有 0.11mm，完全可以兼容使用）
  > ###3、我国常见 GCS
  > 此处不介绍具体来历，需要了解的童鞋自行百度，Google
  > #####3.1 北京 54 坐标系（参心）
- 椭球体：Krasovsky 椭球（克拉索夫斯基椭球）
- 极半径 b=6 356 863.0187730473 m
- 赤道半径 a=6 378 245m
- 扁率=1/298.3
- 高程系：56 黄海系
  #####3.2 西安 80 坐标系（参心）
- 椭球体：IAG 椭球
- 极半径 b=6 356 755m
- 赤道半径 a=6 378 140m
- 扁率=1/298.25722101
- 高程系：85 黄海系
- 大地原点设在我国中部的陕西省泾阳县永乐镇
  #####3.3WGS84 坐标系（地心）
- 解决 GPS 定位而产生的全球统一的一个坐标系
- 椭球体：WGS84 椭球
- 极半径 b=6 356 752.314 245 179 5m
- 赤道半径 a=6 378 137 m
- 扁率=1/298.257223563
- 高程系：根据国家需求定
  #####3.4CGCS2000 坐标系（地心）
- 全球地心坐标系在我国的具体体现
- 椭球体：CGCS2000 坐标系
- 极半径 b=6 356 752.314 140 355 8m
- 赤道半径 a=6 378 137m
- 扁率=1/298.257222101
- 高程系：85 黄海系

【注】CGCS2000 的定义与 WGS84 实质一样。采用的参考椭球非常接近。扁率差异引起椭球面上的纬度和高度变化最大达 0.1mm。当前测量精度范围内，可以忽略这点差异。可以说两者相容至 cm 级水平
![总结表（最后一行即EPSG）.png](https://upload-images.jianshu.io/upload_images/12877063-afca8bcf7898b077.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
EPSG 对世界的每一个地方都制定了地图，但是由于座标系不同，所以地图也各不相同。
所有的 EPSG 均可查到的神奇网站~~<https://epsg.io/> #二、平面坐标和投影坐标系（PCS）

### 1、提出问题

- 如何用经纬度表达一块地的面积？
- 如何建立一个新的坐标系使得地图分析、空间分析得以定量计算？

### 2、什么是投影

- 光线打到物体上，使得物体产生的阴影形状，就叫它的投影
- 地图：把投影的平面改为曲面，产生了不同的投影，比如投射到一个圆锥面上，一个圆柱面上，一个平面上...等等
- PCS 是基于存在的 GCS 的。即：PCS=GCS+投影方式

### 3、我国常用的投影方式

- 高斯克吕格（Gauss Kruger）投影=横轴墨卡托（Transverse Mercator）投影
- 墨卡托（Mercator）投影
- 通用横轴墨卡托（UTM）投影
- Lambert 投影
- Albers 投影
- Web Mercator（网络墨卡托）投影

###### 3.1 高斯克吕格投影/横轴墨卡托投影

- 投影面是椭圆柱面
- 假设椭圆柱躺着，和地轴垂直，而且投影面与之相切，就是横轴墨卡托了
- 等角/横/切椭圆柱/投影
- 投影合适用于导航
- 适用比例尺：1：2.5 万--1：100 万等使用 6 度分带法；1：5000--1：10000 使用 3 度分带法

![高斯克吕格投影/横轴墨卡托投影.png](https://upload-images.jianshu.io/upload_images/12877063-aa958460b0d5039a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> a、中央那条黑线就是投影中心线，与椭圆柱面相切
> b、这条线逢 360° 的因数就可以取，一般多用 3 度带（120 个）、6 度带（60 个）
> c、Y 方向（赤道方向）前需要加投影带号

###### 3.2 墨卡托投影

- 正轴等角切/割圆柱投影
- 高斯克吕格的圆柱面竖起来

###### 3.3 通用横轴墨卡托投影（UTM 投影）

- 横轴等角割圆柱投影
- UTM 投影=0.9996 高斯投影
- 高斯克吕格的投影面是与椭球面相切的，这货与椭球面相割
- 大地测量和地形测量的投影基础
- 我国各种遥感影像的常用投影

###### 3.4Lambert 投影（兰伯特投影）

- 我国地形图常用投影，比如 1：400 万基础数据
- 自定义投影
- 等角圆锥投影
- 圆锥的方向和地轴的方向：正轴、横轴、斜轴

![Lambert投影.png](https://upload-images.jianshu.io/upload_images/12877063-ddb776ead8ecf21a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 3.5Albers 投影（阿伯斯投影）

- 正轴等积割圆锥投影
- 我国各省市的投影
- 与 Lambert 投影的区别就在前者是等角，后者是等积
  ######3.6Web 墨卡托（WebMercator 投影）
- 由 Google 提出的、为了自家 GoogleMap 而专门定义的一种投影，属于墨卡托投影
- 经常被百度地图等网络地图采用 #三、GCS 与 PCS 相互转化（三参数、七参数）（包含 SuperMap iDesktop 转换）
  ###1、GCS 转 GCS
- 进行平移、旋转、缩放三步，可以无序进行

![左为平移，右为旋转.png](https://upload-images.jianshu.io/upload_images/12877063-e609d3350b3a54f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 1.1 利用 SuperMap iDesktop 转换（WGS84 转西安 80）

a、打开某数据源，其中具有地理坐标系为 WGS84 的数据集
![具有地理坐标系为WGS84的数据集.png](https://upload-images.jianshu.io/upload_images/12877063-fc26ed1daafac05f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
b、重设坐标系信息
![重设坐标系.png](https://upload-images.jianshu.io/upload_images/12877063-0a0f318313e66e13.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
c、重新打开数据集即可查看
![西安80坐标系.png](https://upload-images.jianshu.io/upload_images/12877063-6bd198a38484eb10.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
d、相关坐标系参数可在重设弹窗中查看，WGS84 转西安 80，是属于 7 参数转换（地心转参心），在 SuperMap iDesktop 中是默认的，也可根据数据情况来进行坐标系参数的修改

### 2、GCS 进行投影

- 重设投影坐标系即可
- 如果所需投影系没有自己需要的 GCS，就新建一个
  ###3、PCS 转 PCS（重投影）
- 三参数即可
  ###4、根据 ArcGIS 总结如下（网扒图。。）
  ![坐标系转换.png](https://upload-images.jianshu.io/upload_images/12877063-a972762edb78a30b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 四、火星坐标系

- 火星坐标这个东西很常见，出现在互联网地图上。例如百度、腾讯、谷歌等地图。
- 出于保密等政治因素，地图的 GCS 坐标值，会被一种特殊的数学函数加密一次，会偏离真实坐标数百米的距离，但是反馈到用户端的却是正确的位置信息（也就是说你拿到 GCS 坐标也没用，拿 GPS 到实地跑跟拿着地图定位，可能会偏出几十米甚至一百米的距离）。

### 1、火星坐标 (GCJ-02)也叫国测局坐标系

- 中国标准，从国行移动设备中定位获取的坐标数据使用这个坐标系
- 国家规定： 国内出版的各种地图系统（包括电子形式），必须至少采用 GCJ-02 对地理位置进行首次加密。

### 2、百度坐标 (BD-09)

- 百度标准，百度 SDK，百度地图，Geocoding 使用
- 百度又在火星坐标上来个二次加密

### 3、coordtransform 坐标转换

- Github 地址：<https://github.com/wandergis/coordtransform>
- npm 地址：<https://www.npmjs.com/package/coordtransform>

###### 3.1 安装（install）

```shell
npm install coordtransform
```

###### 3.2 示例用法（Example&Usage）

3.2.1 NodeJs 用法

```js
//国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
var coordtransform = require("coordtransform");
//百度经纬度坐标转国测局坐标
var bd09togcj02 = coordtransform.bd09togcj02(116.404, 39.915);
//国测局坐标转百度经纬度坐标
var gcj02tobd09 = coordtransform.gcj02tobd09(116.404, 39.915);
//wgs84转国测局坐标
var wgs84togcj02 = coordtransform.wgs84togcj02(116.404, 39.915);
//国测局坐标转wgs84坐标
var gcj02towgs84 = coordtransform.gcj02towgs84(116.404, 39.915);
console.log(bd09togcj02);
console.log(gcj02tobd09);
console.log(wgs84togcj02);
console.log(gcj02towgs84);
//result
//bd09togcj02:   [ 116.39762729119315, 39.90865673957631 ]
//gcj02tobd09:   [ 116.41036949371029, 39.92133699351021 ]
//wgs84togcj02:  [ 116.41024449916938, 39.91640428150164 ]
//gcj02towgs84:  [ 116.39775550083061, 39.91359571849836 ]
```

3.2.2 浏览器用法
直接引用目录内的 index.js，会有一个 coordtransform 的全局对象暴露出来，也支持用 AMD 加载器加载

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>coordTransform</title>
  </head>
  <body>
    <h1>请按F12打开控制台查看结果</h1>
    <script src="index.js"></script>
    <script>
      //国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)
      //百度经纬度坐标转国测局坐标
      var bd09togcj02 = coordtransform.bd09togcj02(116.404, 39.915);
      //国测局坐标转百度经纬度坐标
      var gcj02tobd09 = coordtransform.gcj02tobd09(116.404, 39.915);
      //wgs84转国测局坐标
      var wgs84togcj02 = coordtransform.wgs84togcj02(116.404, 39.915);
      //国测局坐标转wgs84坐标
      var gcj02towgs84 = coordtransform.gcj02towgs84(116.404, 39.915);
      console.log(bd09togcj02);
      console.log(gcj02tobd09);
      console.log(wgs84togcj02);
      console.log(gcj02towgs84);
      //result
      //bd09togcj02:   [ 116.39762729119315, 39.90865673957631 ]
      //gcj02tobd09:   [ 116.41036949371029, 39.92133699351021 ]
      //wgs84togcj02:  [ 116.41024449916938, 39.91640428150164 ]
      //gcj02towgs84:  [ 116.39775550083061, 39.91359571849836 ]
    </script>
  </body>
</html>
```

# 五、JavaScript 封装方法转换坐标

【注】参数设置正常即可

```js
/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */

//定义一些常量
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02tobd09(lng, lat) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function wgs84togcj02(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat];
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    mglat = lat + dlat;
    mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}

function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
}
```
