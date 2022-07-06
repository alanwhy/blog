> 参考文档：[天地图福州](http://tdt.fuzhou.gov.cn/help)、[GeoServer中WMS、WFS的请求规范](https://www.jianshu.com/p/43ec1e9830f3)、[OGC WMTS 1.0规范的英汉对照翻译稿](https://wenku.baidu.com/view/3c8b364dfe4733687e21aa92?pn=51)
自己遇到的一些问题总结：[有关ogc服务遇到的一些调用问题](https://www.jianshu.com/p/be916f677d06)
##一、什么是OGC？
[OGC](http://www.opengeospatial.org/)，全称是开放**地理空间信息联盟**(Open Geospatial Consortium)，是一个非盈利的国际标准组织，它制定了数据和服务的一系列标准，GIS厂商按照这个标准进行开发可保证**空间数据**的互操作。（来源[百度百科](https://baike.baidu.com/item/OGC/6466060)）
##二、OGC定义了些什么东西？
OGC基于http或者说是web的空间数据操作技术，主要涉及Web Service的相关技术。与ISO/TC211一同推出
 - 基于Web服务（XML）的空间数据互操作实现规范（**本文主要阐述**）
 - 用于空间数据传输与转换的地理信息标记语言GML
 - 提出了一个能无缝集成各种在线空间处理和位置服务的框架即OWS (OGC Web Service)

> **意义**：使得分布式空间处理系统能够通过XML和HTTP技术进行交互，并为各种在线空间数据资源、来自传感器的信息、空间处理服务和位置服务，基于Web的发现、访问、集成、分析、利用和可视化提供互操作框架。
##三、基于Web服务（XML）的空间数据互操作实现规范
![OGC.png](https://upload-images.jianshu.io/upload_images/12877063-cbf985a622c6b63d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


###3.1 WMS
####3.1.1 定义
 - Web地图服务（WMS）利用具有地理空间位置信息的数据制作地图
 - 一个WMS可以动态地生成具有地理参考数据的地图
 - 这些地图通常用GIF、JPEG或PNG等图像格式，或者SVG、KML、VML和WebCGM等矢量图形格式来表现。
 - 使用者通过指定的参数获取相应的地图图片。
####3.1.2 接口
| 接口名称    | 接口说明                                             |
| --------------- | -------------------------------------------------------- |
| GetCapabilities | 返回服务级元数据，它是对服务信息内容和要求参数的一种描述 |
| GetMap          | 获取地图图片。该操作根据客户端发出的请求参数在服务端进行检索，服务器端返回一个地图图像，其地理空间参数和大小参数是已经明确定义的，返回的地图图像可以是GIF、JPEG、PNG或SVG格式。 |
| GetFeatureinfo  | 返回显示在地图上的某些特殊要素的信息。该操作根据用户所请求的X、Y坐标或感兴趣的图层，返回地图上某些特殊要素的信息，信息以HTML，GML或ASCII的格式表示。   |
#####3.1.2.1 GetCapabilities操作请求方法实现参数
| 参数名称   | 参数个数 | 参数类型和值                                                              |
| -------------- | ------------ | ------------------------------------------------------------------------------- |
| service        | 1个(必选) | 字符类型，服务类型值为“WMS”                                      |
| request        | 1个(必选) | 字符类型，请求的操作名称，值为“GetCapabilities”              |
| version        | 0或1个(可选) | 字符类型，值为请求的WMS的版本号                                   |
| format         | 0或1个(可选) | MIME类型，值为服务元数据的输出格式                               |
| updateSequence | 0或1个(可选) | 字符类型，可取的值有none、any、equal、lower、higher，用来表示缓存数据更新的方式 |
示例：http://127.0.0.1:8090/iserver/services/maps/wms130/World?request=getcapabilities&service=wms
示例2：http://tdt.fuzhou.gov.cn/serviceaccess/WMS/DMDZ?version=1.1.1&request=GetCapabilities&service=WMS
#####3.1.2.2 GetMap操作请求方法实现参数
| 参数名称 | 参数个数 | 参数类型和值                                                          |
| ----------- | ------------ | --------------------------------------------------------------------------- |
| service     | 1个(必选) | 字符类型，服务类型标识值为“WMS”                            |
| request     | 1个(必选) | 字符类型，值为“GetMap”                                           |
| version     | 1个(必选) | 字符类型，值为请求的WMS的版本号                               |
| layers      | 1个(必选) | 字符类型，值为一个或多个地图图层列表，多个图层之间用”,”隔开 |
| styles      | 1个(必选) | 字符类型，值为请求图层的地图渲染样式                      |
| CRS         | 1个(必选) | 字符类型，值为坐标参照系统                                     |
| BBOX        | 1个(必选) | Wkt格式，值为某个CRS下的地图边界范围的坐标序列          |
| width       | 1个(必选) | 整型类型，值为地图图片的像素宽度                            |
| height      | 1个(必选) | 整型类型，值为地图图片的像素高度                            |
| format      | 1个(必选) | 字符类型，值为地图的输出格式                                  |
| transparent | 0或1个(可选) | 字符类型，值为true或者false，用来表示地图图层是否透明(默认情况下是不透明的) |
| bgcolor     | 0或1个(可选) | 值为十六进制的RGB值，表示地图的背景颜色                   |
| exceptions  | 0或1个(可选) | 值为WMS的异常信息报告的格式(默认情况下是XML格式)        |
| time        | 0或1个(可选) | 时间类型，值为时间值，表示需要在图层中有时间信息    |
| elevation   | 0或1个(可选) | 数字类型，值为高程值，表示需要在图层中有高程信息    |
示例：http://127.0.0.1:8090/iserver/services/maps/wms130/World?LAYERS=0&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&SRS=EPSG%3A3857&BBOX=10008053.503544,5274522.8578226,10039584.01305,5292493.614536&WIDTH=579&HEIGHT=330
示例2：http://tdt.fuzhou.gov.cn/serviceaccess/WMS/DMDZ?version=1.1.1&request=GetMap&service=WMS&mapservice=DMDZ&layers=1&styles=default&width=1164&height=371&format=png&transparent=true&srs=EPSG%3A4490&bbox=119.28758165903027,26.090243729688037,119.28914270467693,26.0907412794603
#####3.1.2.3 GetFeatureInfo操作请求方法实现参数
| 参数名称     | 参数个数 | 参数类型和值                                                |
| ---------------- | ------------ | ----------------------------------------------------------------- |
| service          | 1个(必选) | 字符类型，服务类型标识值为“WMS”                  |
| request          | 1个(必选) | 字符类型，值为“GetFeatureInfo”                         |
| version          | 1个(必选) | 字符类型，值为请求的WMS的版本号                     |
| map request part | 1个(必选) | 字符类型，值为获得地图的部分操作参数            |
| query_layers     | 1个(必选) | 字符类型，值为查询的一个或多个地图图层列表，多个图层之间用”,”隔开 |
| info_format      | 1个(必选) | MIME类型，值为请求信息的返回类型                    |
| I                | 1个(必选) | 整型类型，值为待查询点的在地图图片上的像素列号 |
| J                | 1个(必选) | 整型类型，值为待查询点的在地图图片上的像素行号 |
| feature_count    | 0或1个(可选) | 整型类型，值为返回信息中的要素的个数(默认是1) |
| exceptions       | 0或1个(可选) | 值为WMS的异常信息报告的格式(默认情况下是XML格式) |
示例：http://127.0.0.1:8090/iserver/services/maps/wms130/World?REQUEST=GetFeatureInfo&EXCEPTIONS=application%2Fvnd.ogc.se_xml&BBOX=10008053.503544%2C5274522.857823%2C10039584.01305%2C5292493.614536&SERVICE=WMS&INFO_FORMAT=text/plain&QUERY_LAYERS=urbanlayer%3ADIJI&FEATURE_COUNT=50&Layers=urbanlayer%3ADIJI&WIDTH=579&HEIGHT=330&format=image%2Fpng&styles=&srs=EPSG%3A3857&version=1.3.0&x=315&y=147

###3.2WFS
####3.2.1 定义
 - Web要素服务（WFS）返回的是要素级的GML编码，并提供对要素的增加、修改、删除等事务操作，是对Web地图服务的进一步深入
- 回结果的是XML格式的WFS服务元数据文档

####3.2.2 接口
| 接口名称        | 接口说明                                                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GetCapabilities     | GetCapabilities请求用于查询WFS服务的能力信息，包括支持的操作、支持的格式、空间坐标、包含的资源等。它主要的目的是使客户端在使用GetFeature请求前可以对WFS服务有一个基本的了解，从而可以设置正确的参数。 |
| DescribeFeatureType | 返回描述可以提供服务的任何要素结构的XML文档，即图层描述信息 |
| GetFeature          | 为一个获取要素实例的请求提供服务，通过GetFeature操作可以由指定的属性条件、空间条件或者两者叠加的条件进行空间查询。 |
| Transaction         | 为事务请求提供服务，使客户端可对服务器端所提供的地图要素类执插入，更新，删除等命令                                                                               |
| GetGmlObject        | 通过XLink获取GML对象                                                                                                                                                                            |
| LockFeature         | 处理在一个事务期间对一个或多个要素类型实例上锁的请求                                                                                                                                                                        |
#####3.2.2.1 GetCapabilities操作请求方法实现参数
| 参数名称 | 参数个数 | 参数类型和值                              |
| -------- | ------------ | ----------------------------------------------- |
| service  | 1个(必选) | 字符类型，服务类型值为“WFS”      |
| request  | 1个(必选) | 字符类型，请求的操作名称，值为“GetCapabilities” |
| versions | 0或1个(可选) | 字符类型，值为请求的WFS的版本号   |
示例：http://127.0.0.1:8090/iserver/services/data-world/wfs100/utf-8?service=wfs&version=1.1.0&request=GetCapabilities
示例2：http://tdt.fuzhou.gov.cn/serviceaccess/WFS/DMDZ_WFS-G?service=WFS&request=GetCapabilities&version=1.0.0
#####3.2.2.2 DescribeFeatureType操作请求方法实现参数
| 参数名称 | 参数个数 | 参数类型和值                                                             |
| ------------ | ------------ | ------------------------------------------------------------------------------ |
| service      | 1个(必选) | 字符类型，服务类型值为“WFS”                                     |
| request      | 1个(必选) | 字符类型，请求的操作名称，值为“DescribeFeatureType”         |
| typeName     | 0或1个(可选) | 字符类型，值为要素类型的列表，多个值之间用“，”隔开，默认解析包括的全部要素类型 |
| outputFormat | 0或1个(可选) | MIME类型，值为输出格式                                                |
示例：http://tdt.fuzhou.gov.cn/serviceaccess/WFS/DMDZ_WFS-G?service=WFS&request=DescribeFeatureType&typename=DMDZ:地名&version=1.0.0
#####3.2.2.3 GetFeature操作请求方法实现参数
| 参数名称   | 参数个数 | 参数类型和值                                                                            |
| -------------- | ------------ | --------------------------------------------------------------------------------------------- |
| service        | 1个(必选) | 字符类型，服务类型标识值为“WFS”                                              |
| request        | 1个(必选) | 字符类型，请求的操作值为“GetFeature”                                          |
| typeName       | 1个(必选) | 字符类型，值为请求的要素类型的名称，多个名称之间用“，”隔开    |
| version        | 0或1个(可选) | 字符类型，值为请求的WFS的版本号                                                 |
| outputFormat   | 0或1个(可选) | MIME类型，值为输出格式                                                               |
| resultType     | 0或1个(可选) | 字符类型，值为请求的结果类型                                                    |
| propertyName   | 0或1个(可选) | 字符类型，值为请求要素的属性名，多个值之间用“，”隔开             |
| featureVersion | 0或1个(可选) | 字符类型，值为要素的版本，值为ALL返回请求的要素的所有版本，没有值默认为返回请求要素的最新版本 |
| maxFeature     | 0或1个(可选) | 整型类型，值为请求要素的最大数，默认值为满足查询的所有结果集    |
| expiry         | 0或1个(可选) | 数字类型，要素被锁定的时间                                                       |
| SRSName        | 0或1个(可选) | 字符类型，值为坐标系统名                                                          |
| featureID      | 0或1个(可选) | 字符类型，值为要素的ID，多个ID之间用“，”隔开                           |
| filter         | 0或1个(可选) | 请求要素的过滤条件                                                                   |
| bBox           | 0或1个(可选) | Wkt格式，请求指定要素查询范围，可以替代featureId和filter参数             |
| sortby         | 0或1个(可选) | 字符类型，查询结果属性值的排序依据                                           |
示例：http://tdt.fuzhou.gov.cn/serviceaccess/WFS/DMDZ_WFS-G?service=WFS&request=GetFeature&typename=DMDZ:地名&version=1.0.0&maxFeature=20
###3.3WCS
####3.3.1 定义
- Web栅格服务面向空间影像数据
- 将包含地理位置值的地理空间数据作为“栅格（Coverage）”在网上相互交换
- 允许用户访问“Coverage”数据，如卫星影像、数字高程数据等，也就是栅格数据
####3.3.2 接口
| 接口名称     | 接口说明                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| GetCapabilities  | 返回描述服务和数据集的XML文档                                                                            |
| DescribeCoverage | 在GetCapabilities确定什么样的查询可以执行、什么样的数据能够获取之后执行的，它使用通用的栅格格式返回地理位置的值或属性 |
| GetCoverage      | 允许客户端请求由具体的WCS服务器提供的任一覆盖层的完全描述                                  |
#####3.3.2.1 GetCapabilities操作请求方法实现参数
| 参数名称   | 参数个数   | 参数类型和值                                                                                            |
| -------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| SERVICE        | 1个（必选） | 字符类型，服务类型为“WCS”                                                                       |
| REQUEST        | 1个（必选） | 字符类型，请求的操作名称，值为“GetCapabilities”                                            |
| ACCEPTVERSIONS | 0或1个（可选） | 字符类型，值为请求的WMTS的版本号                                                                |
| SECTIONS       | 0或1个（可选） | 字符类型，请求元数据文档0或多个节的名称，多个名称之间用“，”隔开，不须按顺序排列。值为空默认返回整个元数据文档 |
| UPDATESEQUENCE | 0或1个（可选） | 字符类型，值为increased，为空时默认返回最新的元数据文档                                |
| ACCEPTFORMATS  | 0或1个（可选） | 字符类型，接受的格式                                                                                |
示例：http://hostname:port/path?service=WCS&request=GetCapabilities
#####3.3.2.2 DescribeCoverage操作请求方法实现参数
| 参数名称 | 参数个数 | 参数类型和值                               |
| ----------- | ----------- | ------------------------------------------------ |
| VERSION     | 1个（必选） | 字符类型，值为请求的WCS的版本号    |
| SERVICE     | 1个（必选） | 字符类型，服务类型为“WCS”          |
| REQUEST     | 1个（必选） | 字符类型，请求的操作名称，值为“DescribeCoverage” |
| IDENTIFIERS | 1个（必选） | 字符类型，标识符                         |
示例：http://server_address/path/script?service=WCS &request=DescribeCoverage&version=1.1.2 &identifiers=Cov1,Cov2,Cov3
#####3.3.2.3 GetCoverage操作请求方法实现参数
| 参数名称 | 参数个数 | 参数类型和值                          |
| -------- | ----------- | ------------------------------------------- |
| VERSION  | 1个（必选） | 字符类型，值为请求的WCS的版本号 |
| SERVICE  | 1个（必选） | 字符类型，服务类型为“WCS”     |
| REQUEST  | 1个（必选） | 字符类型，请求的操作名称，值为“GetCoverage” |
| coverage | 1个（必选） | 字符类型，请求的图层名称        |
| BBOX     | 1个（必选） | 字符类型，请求的图层显示范围  |
| CRS      | 1个（必选） | 字符类型，请求的坐标系代码     |
| FORMAT   | 1个（必选） | 字符类型，请求图片格式           |
示例：http://server_address/path/script?service=WCS &request=GetCoverage&version=1.1.2&coverage=wcs_layer&BBOX=4785268.8040398322045803,12847916.7660075146704912,5021045.0965897748246789,13079930.6709103845059872&CRS=EPSG:3857&FORMAT=image/png
###3.4WMTS
####3.4.1 定义
- 和WMS并列的重要OGC规范之一
- 采用缓存技术能够缓解WebGIS服务器端数据处理的压力，提高交互响应速度
- 目前各种缓存技术相互兼容的一种方法
####3.4.2 接口
| 接口名称    | 接口描述                                                                             |
| --------------- | ---------------------------------------------------------------------------------------- |
| GetCapabilities | 获取WMTS的能力文档（即元数据文档），里面包含服务的所有信息    |
| GetTile         | 获取地图瓦片。该操作根据客户端发出的请求参数在服务端进行检索，服务器端返回地图瓦片图像。 |
| GetFeatureInfo  | 通过在WMTS图层上指定一定的条件，返回指定的地图瓦片内容对应的要素信息 |
#####3.4.2.1 GetCapabilities操作请求方法实现参数
| 参数名称   | 参数个数 | 参数类型和值                                                                                            |
| -------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| service        | 1个(必选) | 字符类型，服务类型值为“WMTS”                                                                   |
| request        | 1个(必选) | 字符类型，请求的操作名称，值为“GetCapabilities”                                            |
| acceptVersions | 0或1个(可选) | 字符类型，值为请求的WMTS的版本号                                                                |
| sections       | 0或1个(可选) | 字符类型，请求元数据文档0或多个节的名称，多个名称之间用“，”隔开，不须按顺序排列。值为空默认返回整个元数据文档 |
| updateSequence | 0或1个(可选) | 字符类型，值为increased，为空时默认返回最新的元数据文档                                |
| acceptFormat   | 0或1个(可选) | MIME类型，值为服务元数据的输出格式                                                             |
示例：http://tdt.fuzhou.gov.cn/serviceaccess/wmts/Vector2012CGCS2000?service=WMTS&request=GetCapabilities
#####3.4.2.2 GetTile操作请求方法实现参数
| 参数名称            | 参数个数 | 参数类型和值                                     |
| ----------------------- | ------------ | ------------------------------------------------------ |
| service                 | 1个(必选) | 字符类型，服务类型标识值为“WMTS”      |
| request                 | 1个(必选) | 字符类型，请求的操作值为“GetTile”      |
| version                 | 1个(必选) | 字符类型，值为请求的WMTS的版本号         |
| layer                   | 1个(必选) | 字符类型，值为请求的图层名称             |
| style                   | 1个(必选) | 字符类型，值为请求图层的渲染样式       |
| format                  | 1个(必选) | 字符类型，值为瓦片地图的输出格式       |
| tileMatrixSet           | 1个(必选) | 字符类型，瓦片矩阵数据集，其值在服务的元数据文档中指定 |
| tileMatrix              | 1个(必选) | 字符类型，瓦片矩阵，其值在服务的元数据文档中指定 |
| tileRow                 | 1个(必选) | 整型类型，值为大于0的整数，表示瓦片矩阵的行号 |
| tileCol                 | 1个(必选) | 整型类型，值为大于0的整数，表示瓦片矩阵的列号 |
| Other sample dimensions | 0或1个(可选) | 字符类型，其他允许的参数                   |
示例：http://tdt.fuzhou.gov.cn/serviceaccess/wmts/Vector2012CGCS2000?service=WMTS&request=GetTile&layer=0&style=default&tileMatrixSet=sss&tileMatrix=10&tileRow=93074&tileCol=435872&format=image/png
#####3.4.2.3 GetFeatureInfo操作请求方法实现参数
| service                                                                             | 1个(必选) | 字符类型，服务类型值为“WMTS”             |
| ----------------------------------------------------------------------------------- | --------- | ------------------------------------------------------- |
| request                                                                             | 1个(必选) | 字符类型，请求的操作值为“GetFeatureInfo” |
| version                                                                             | 1个(必选) | 字符类型，值为请求的WMTS的版本号          |
| J                                                                                   | 1个(必选) | 整型类型，值为大于0的整数，表示瓦片上一指定像素点的行号 |
| I                                                                                   | 1个(必选) | 整型类型，值为大于0的整数，表示瓦片上一指定像素点的列号 |
| info_format                                                                         | 1个(必选) | MIME类型，值为请求信息的返回类型          |
| layer, style, format, Sample dimension, tileMatrixSet, tileMatrix, tileRow, tileCol | 1个(必选) | 这些参数的值应与请求GetTile的相应参数保持一致 |
