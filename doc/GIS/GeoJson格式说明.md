GeoJSON 是基于 JavaScript 对象表示法的地理空间信息数据交换格式。 ###一、简介
GeoJSON 是一种对各种地理数据结构进行编码的格式。GeoJSON 对象可以表示几何、特征或者特征集合。GeoJSON 支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON 里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。
一个完整的 GeoJSON 数据结构总是一个（JSON 术语里的）对象。在 GeoJSON 里，对象由名/值对--也称作成员的集合组成。对每个成员来说，名字总是字符串。成员的值要么是字符串、数字、对象、数组，要么是下面文本常量中的一个："true","false"和"null"。数组是由值是上面所说的元素组成。

#### 1.1 举例

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [102.0, 0.5] },
      "properties": { "prop0": "value0" }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0]
        ]
      },
      "properties": {
        "prop0": "value0",
        "prop1": 0.0
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      },
      "properties": {
        "prop0": "value0",
        "prop1": { "this": "that" }
      }
    }
  ]
}
```

### 二、GeoJson 对象

GeoJSON 总是由一个单独的对象组成。这个对象（指的是下面的 GeoJSON 对象）表示几何、特征或者特征集合。

- GeoJSON 对象可能有任何数目成员（名/值对）。
- GeoJSON 对象必须由一个名字为"type"的成员。这个成员的值是由 GeoJSON 对象的类型所确定的字符串。
- type 成员的值必须是下面之一："Point", "MultiPoint", "LineString", "MultiLineString", "Polygon",    "MultiPolygon",   "GeometryCollection", "Feature", 或者 "FeatureCollection"。这儿 type 成员值必须如这儿所示。
- GeoJSON 对象可能有一个可选的"crs"成员，它的值必须是一个坐标参考系统的对象。
- GeoJSON 对象可能有一个"bbox"成员，它的值必须是边界框数组。
  ####2.1 几何对象
  几何是一种 GeoJSON 对象，这时 type 成员的值是下面字符串之一："Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", 或者"GeometryCollection"。

除了“GeometryCollection”外的其他任何类型的 GeoJSON 几何对象必须由一个名字为"coordinates"的成员。coordinates 成员的值总是数组。这个数组里的元素的结构由几何类型来确定。

##### 2.1.1 位置

位置是基本的几何结构。几何对象的"coordinates"成员由一个位置（这儿是几何点）、位置数组（线或者几何多点），位置数组的数组（面、多线）或者位置的多维数组（多面）组成。

位置由数字数组表示。必须至少两个元素，可以有更多元素。元素的顺序必须遵从 x,y,z 顺序（投影坐标参考系统中坐标的东向、北向、高度或者地理坐标参考系统中的坐标长度、纬度、高度）。任何数目的其他元素是允许的---其他元素的说明和意义超出了这篇规格说明的范围。

##### 2.1.2 点

对类型"Point"来说，“coordinates"成员必须是一个单独的位置。

```json
{
  "type": "Point",
  "coordinates": [100.0, 0.0]
}
```

##### 2.1.3 多点

对类型"MultiPoint"来说，"coordinates"成员必须是位置数组。

```json
{
  "type": "MultiPoint",
  "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
  }
```

##### 2.1.4 线

对类型"LineString"来说，“coordinates"成员必须是两个或者多个位置的数组。

线性环市具有 4 个或者更多位置的封闭的线。第一个和最后一个位置是相等的（它们表示相同的的点）。虽然线性环没有鲜明地作为 GeoJSON 几何类型，不过在面几何类型定义里有提到它。

```json
{
  "type": "LineString",
  "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
  }
```

##### 2.1.5 多线

对类型“MultiLineString"来说，"coordinates"成员必须是一个线坐标数组的数组。

```json
{
  "type": "MultiLineString",
  "coordinates": [
      [ [100.0, 0.0], [101.0, 1.0] ],
      [ [102.0, 2.0], [103.0, 3.0] ]
    ]
  }
```

##### 2.1.6 面

对类型"Polygon"来说，"coordinates"成员必须是一个线性环坐标数组的数组。对拥有多个环的的面来说，第一个环必须是外部环，其他的必须是内部环或者孔。
无孔的：

```json
{
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    ]
 }
```

有孔的：

```json
 {
  "type": "Polygon",
  "coordinates": [
    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ]
 }
```

##### 2.1.7 多面

对类型"MultiPlygon"来说，"coordinates"成员必须是面坐标数组的数组。

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
    [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
     [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
    ]
  }
```

##### 2.1.8 几何集合

类型为"GeometryCollection"的 GeoJSON 对象是一个集合对象，它表示几何对象的集合。

几何集合必须有一个名字为"geometries"的成员。与"geometries"相对应的值是一个数组。这个数组中的每个元素都是一个 GeoJSON 几何对象。

```json
{
  "type": "GeometryCollection",
  "geometries": [
      {
      "type": "Point",
      "coordinates": [100.0, 0.0]
      },
      {
      "type": "LineString",
      "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
      }
  ]
}
```

#### 2.2 特征对象

类型为"Feature"的 GeoJSON 对象是特征对象。

- 特征对象必须由一个名字为"geometry"的成员，这个几何成员的值是上面定义的几何对象或者 JSON 的 null 值。
- 特征对戏那个必须有一个名字为“properties"的成员，这个属性成员的值是一个对象（任何 JSON 对象或者 JSON 的 null 值）。
- 如果特征是常用的标识符，那么这个标识符应当包含名字为“id”的特征对象成员。

#### 2.3 特征对象集合

类型为"FeatureCollection"的 GeoJSON 对象是特征集合对象。

类型为"FeatureCollection"的对象必须由一个名字为"features"的成员。与“features"相对应的值是一个数组。这个数组中的每个元素都是上面定义的特征对象。

> 参考原文：[GeoJSON 格式规范说明](https://www.oschina.net/translate/geojson-spec)
