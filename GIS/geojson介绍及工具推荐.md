<!--
 * @Author: wuhaoyuan
 * @Date: 2022-09-05 09:44:57
 * @LastEditTime: 2022-09-05 14:12:40
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/GIS/geojson介绍及工具推荐.md
-->

# geojson 介绍及工具推荐

## 什么是 GeoJSON

GeoJSON 是一种基于 JSON 的地理空间数据交换格式。它定义了几种类型的 JSON 对象，以及将它们组合起来表示有关地理特征、属性和空间范围的数据的方式。GeoJson 使用了经纬度参考系统、 WGS84 坐标系统和十进制单位。

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
```

## GeoJSON 数据类型

地理数据常见类型就是点、线、面三种，实际应用中又扩展了多点、多线、多面几种数据格式。

![](/img/640.png)

polygon 可以表达带洞的多边形, Polygon Coordinates 字段中第一个点序列表示外环，第二个及其他表示内环。

带洞的多边形使用场景很多，比如水系，河流三角洲等等。

![](/img/640 (1).png)

## Polygon 坐标约束

- 对于类型 `Polygon`，`coordinates` 成员必须是一个”线性环坐标数组“组成的数组,既第一个点和最后一个点是一样的。因此 表达一个 4 边形需要 5 个顶点。
- 对于多边形有一个以上的环，第一个必须是外环，其他的必须是内环。外环与表面形成边界，内环(如果存在)与表面形成边界孔。

## 多几何体

![](/img/iShot_2022-09-05_09.59.45.png)

多几何体和单几何体的数据格式最大差别在于，coordinates 数据维度比单几何体多一维，单点是一维数组，多点是二维。

多面的使用场景比较多，在行政区划中很多城市不是连续的多边形，多个分开的多边形组成。

## 属性定义

GeoJSON 除了定义空间数据的格式还约定了如何表达属性, 属性通过 properties 字段定义。

```json
{
  "type": "Feature",
  "properties": {
    "name": "122"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [225, -43.06888777416961]
  }
}
```

## 数据集合

FeatureCollection 对象有一个名为“ features”的属性。“features”的值是一个 JSON 数组。数组的每个元素都是上面定义的特征对象。这个数组可能为空，一般数据中 features 会存储同一类型的数据，比如点数据（点或多点）一组，一般不会混合存储，分开定义在数据可视化的时方便表达。

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [225, -43.06888777416961]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-91.40625, 24.5271348225978]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [36.5625, 67.60922060496382]
      }
    }
  ]
}
```

## 网站推荐

- [GeoJSON 数据编辑](http://geojson.io)
- [GeoJSON 数据简化编辑](http://www.mapshaper.org/)
- [GeoJSON 数据可视化](https://github.com/antvis/L7)
- [GeoJSON 标准草案](https://www.rfc-editor.org/rfc/rfc7946)
