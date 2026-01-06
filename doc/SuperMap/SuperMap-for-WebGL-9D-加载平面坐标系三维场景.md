众所周知，SuperMap 基于 Cesium 做的 WebGL 展示三维有很多新的特性及优点，本文就不赘述了，附上一个官方链接：
[SuperMap iClient3D 9D(2019) for WebGL-三维客户端开发平台](https://www.supermap.com/cn/xhtml/SuperMap-iClient3D-for-WebGL-9D.html)

[Cesium](https://cesiumjs.org/)（<==戳）也是国外很优秀的开源框架，基于 JavaScript 的使用 WebGL 的地图（场景）引擎，本文也就不赘述了

##一、加载平面场景存在的问题

- 纯开源的 Cesium 不支持加载平面坐标系三维
- SuperMap 的加载方式会存在数据位置不是真实位置的情况
- 部分三维分析功能无法实现 ##二、问题的逐个击破
  ####1、对于纯开源的 Cesium 不支持平面坐标系的三维场景
  SuperMap 的研发团队进行了二次开发，将当前场景的坐标系通过一系列的公式计算转换后，将场景放置在了经线 0° 的位置（本初子午线），具体的代码不方便提供，大家明白原理即可；
  ####2、不是真实位置的情况
  接着上一个问题，因为放在了本初子午线的位置，导致了当前场景的位置非原始场景的坐标系位置（比如，原坐标系单位是米，或者政务坐标，地方坐标之类的，而 WebGL 本身只支持 WGS84 的坐标系）。
  处理方式： ######（1）换底图
  首先需要先将整个球面换上一张自己的图片，这样可以理解为不是加载地球上的场景，建议换一张灰色的底图，或者根据业务需求更换即可；（代码采用 vuejs 的框架，有些参数可以参看具体[API](http://supermap.com:8090/webgl/Build/Documentation/index.html)或[官方示例](http://supermap.com:8090/webgl/examples/examples.html#layer)）
  代码如下：

```
viewerOptions.imageryProvider = new Cesium.SingleTileImageryProvider({
  url: './static/img/background.png'
});
let viewer = new Cesium.Viewer(this.$el, viewerOptions)
```

######（2）换展示方式
接着需要将场景的展示方式改为哥伦布视图（2.5D），这样就可以展示出平面的效果

```
viewerOptions.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;
```

######（3）定位坐标的确定
因为不是真实的平面坐标，也不可以使用转换出来的 wgs84 的坐标，所以需要再代码里面用公式来将平面的坐标转换成 WebGL 的基于本初子午线的坐标

```
// cesiumX为平面坐标X，cesiumY为平面坐标Y，cameraCfg.destination.z为平面坐标为平面坐标Z
// pointCX和pointCY即为转换后的基于本初子午线的WGS84的坐标值
let point = new Cesium.Cartesian3(parseFloat(cesiumX), parseFloat(cesiumY), parseFloat(cameraCfg.destination.z))
let pointCartographic = Viewer.scene.camera._projection.unproject(point)
let pointCX = Cesium.Math.toDegrees(pointCartographic.longitude)
let pointCY = Cesium.Math.toDegrees(pointCartographic.latitude)
```

> 注意：Z 的值是不会改变的，可以简单的理解为是高度，但其实再 Cesium 中不是真正的高度

之后在进行定位或飞行

```
scene.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(pointCX, pointCY, pointCartographic.height),
  orientation: {
    heading: cameraCfg.orientation.heading,
    pitch: cameraCfg.orientation.pitch,
    roll: cameraCfg.orientation.roll
  }
})
```

######（4）高程数据的处理
如果数据是带有高程的数据，但是却没有地形数据的时候，可以通过设置三维图层的底部高度来进行与地面的贴合

```
let style = new Cesium.Style3D();
style.bottomAltitude = -45;
layer.style3D = style;
layer.refresh();
```

可参看示例：http://supermap.com:8090/webgl/examples/editor.html#S3MTiles_srsb_water ######（5）关于 camera 属性的说明
![camera.png](https://upload-images.jianshu.io/upload_images/12877063-1651ad8eb3ccd297.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如图，关于（3）中的代码转化就是将`position`转换成了`_positionCartographic`，再进行了弧度转经纬度的方法
####3、部分三维分析功能无法使用
截至 2019/01/16，如果跟图层操作较为密切的功能是无法实现的，如：地形挖方（需要地形数据），阴影分析，光照分析，控高分析（需要地形数据）等
正常使用且常用的：可视域分析，通视分析，天际线分析，场景飞行，测量； ##三、部分代码提供
1、vuejs

```
    initScene() {
      let self = this
      let viewerOptions = {
        shadows: true,
        navigation: false,
        selectionIndicator: false,
        infoBox: false
      };
      let viewer = new Cesium.Viewer(this.$el, viewerOptions)
      window.Viewer = viewer
      viewer._cesiumWidget._creditContainer.style.display = 'none';
      let scene = viewer.scene;
      let promise = scene.open(VGL.url)
      Cesium.when.all(promise, (layers) => {
        ...
      })
    }
```

2、非框架

```
    function onload(Cesium) {
      //初始化viewer部件
      viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.SingleTileImageryProvider({
          url: './images/background.png'
        }),
        sceneMode: Cesium.SceneMode.COLUMBUS_VIEW
      });
      var scene = viewer.scene;
      var widget = viewer.cesiumWidget;
      viewer._cesiumWidget._creditContainer.style.display = 'none';
      try {
        //打开所发布三维服务下的所有图层
        var url5 = "http://127.0.0.1:8090/iserver/services/3D-ZhanLanLu/rest/realspace";
        var promise = scene.open(url5);
        Cesium.when.all(promise, function(layers) {

          layers.forEach(function(item, index) {
            item.ignoreNormal = true // 获取或者设置是否在GPU中自动计算法线
            item.clearMemoryImmediately = true // 是否及时释放内存
          })

          var point = new Cesium.Cartesian3(X, Y, Z);
          var pointCartographic = scene.camera._projection.unproject(point);
          var pointCX = Cesium.Math.toDegrees(pointCartographic.longitude);
          var pointCY = Cesium.Math.toDegrees(pointCartographic.latitude);

          //设置相机位置，定位至模型
          scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(pointCX, pointCY, pointCartographic.height),
            orientation: {
              heading: heading,
              pitch: pitch,
              roll: roll
            }
          });
        }, function(e) {
          if (widget._showRenderLoopErrors) {
            var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
            widget.showErrorPanel(title, undefined, e);
          }
        });
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          var title = '渲染时发生错误，已停止渲染。';
          widget.showErrorPanel(title, undefined, e);
        }
      }
    }
```
