本文转载，只收藏不常见的，平时不太清楚要如何实现的

### 椭圆形

![image.png](https://upload-images.jianshu.io/upload_images/12877063-a4dd8c92b548aad2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# oval {
  width: 200px;
  height: 100px;
  background: red;
  border-radius: 100px / 50px;
}
```

### 上三角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-f5c4a7052be475a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-up {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

### 下三角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-f8cf419989165ffe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-down {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 100px solid red;
}
```

### 左三角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-549211df54efcbde.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-left {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-right: 100px solid red;
  border-bottom: 50px solid transparent;
}
```

### 右三角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-0fb9e70488b8cbba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-right {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-left: 100px solid red;
  border-bottom: 50px solid transparent;
}
```

### 左上角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-7de4e92d0031434a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-topleft {
  width: 0;
  height: 0;
  border-top: 100px solid red;
  border-left: 100px solid transparent;
}
```

### 右上角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-3cc021e9ba166ce2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-topright {
  width: 0;
  height: 0;
  border-top: 100px solid red;
  border-left: 100px solid transparent;
}
```

### 左下角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-7f2b7c636141601e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-bottomleft {
  width: 0;
  height: 0;
  border-bottom: 100px solid red;
  border-right: 100px solid transparent;
}
```

### 右下角

![image.png](https://upload-images.jianshu.io/upload_images/12877063-1bc3335286660e87.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# triangle-bottomright {
  width: 0;
  height: 0;
  border-bottom: 100px solid red;
  border-left: 100px solid transparent;
}
```

### 箭头

![image.png](https://upload-images.jianshu.io/upload_images/12877063-c6a3f6740d74cbc2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# curvedarrow {
  position: relative;
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-right: 9px solid red;
  transform: rotate(10deg);
}
# curvedarrow:after {
  content: "";
  position: absolute;
  border: 0 solid transparent;
  border-top: 3px solid red;
  border-radius: 20px 0 0 0;
  top: -12px;
  left: -9px;
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
}
```

### 梯形

![image.png](https://upload-images.jianshu.io/upload_images/12877063-aa1f50885bf31af0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# trapezoid {
  border-bottom: 100px solid red;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  height: 0;
  width: 100px;
}
```

### 平行四边形

![image.png](https://upload-images.jianshu.io/upload_images/12877063-9ab4225459cff122.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# parallelogram {
  width: 150px;
  height: 100px;
  transform: skew(20deg);
  background: red;
}
```

### 星星（五角）

![image.png](https://upload-images.jianshu.io/upload_images/12877063-45bfdaf75c12f16c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# star-five {
  margin: 50px 0;
  position: relative;
  display: block;
  color: red;
  width: 0px;
  height: 0px;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  border-left: 100px solid transparent;
  transform: rotate(35deg);
}
# star-five:before {
  border-bottom: 80px solid red;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  position: absolute;
  height: 0;
  width: 0;
  top: -45px;
  left: -65px;
  display: block;
  content: "";
  transform: rotate(-35deg);
}
# star-five:after {
  position: absolute;
  display: block;
  color: red;
  top: 3px;
  left: -105px;
  width: 0px;
  height: 0px;
  border-right: 100px solid transparent;
  border-bottom: 70px solid red;
  border-left: 100px solid transparent;
  transform: rotate(-70deg);
  content: "";
}
```

### 爱心

![image.png](https://upload-images.jianshu.io/upload_images/12877063-69262195ebc4c122.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# heart {
  position: relative;
  width: 100px;
  height: 90px;
}
# heart:before,
# heart:after {
  position: absolute;
  content: "";
  left: 50px;
  top: 0;
  width: 50px;
  height: 80px;
  background: red;
  border-radius: 50px 50px 0 0;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}
# heart:after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}
```

### 菱形

![image.png](https://upload-images.jianshu.io/upload_images/12877063-b73bd1a1443209db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# diamond {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom-color: red;
  position: relative;
  top: -50px;
}
# diamond:after {
  content: "";
  position: absolute;
  left: -50px;
  top: 50px;
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-top-color: red;
}
```

### 对话泡泡

![image.png](https://upload-images.jianshu.io/upload_images/12877063-844907cf99f15c34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# talkbubble {
  width: 120px;
  height: 80px;
  background: red;
  position: relative;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}
# talkbubble:before {
  content: "";
  position: absolute;
  right: 100%;
  top: 26px;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-right: 26px solid red;
  border-bottom: 13px solid transparent;
}
```

### 太极

![image.png](https://upload-images.jianshu.io/upload_images/12877063-b6493d08add7a19c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# yin-yang {
  width: 96px;
  box-sizing: content-box;
  height: 48px;
  background: #eee;
  border-color: red;
  border-style: solid;
  border-width: 2px 2px 50px 2px;
  border-radius: 100%;
  position: relative;
}
# yin-yang:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  background: #eee;
  border: 18px solid red;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  box-sizing: content-box;
}
# yin-yang:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background: red;
  border: 18px solid #eee;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  box-sizing: content-box;
}
```

### 太空入侵者

![image.png](https://upload-images.jianshu.io/upload_images/12877063-d733d786958a0316.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```tap
# space-invader {
  box-shadow: 0 0 0 1em red,
  0 1em 0 1em red,
  -2.5em 1.5em 0 .5em red,
  2.5em 1.5em 0 .5em red,
  -3em -3em 0 0 red,
  3em -3em 0 0 red,
  -2em -2em 0 0 red,
  2em -2em 0 0 red,
  -3em -1em 0 0 red,
  -2em -1em 0 0 red,
  2em -1em 0 0 red,
  3em -1em 0 0 red,
  -4em 0 0 0 red,
  -3em 0 0 0 red,
  3em 0 0 0 red,
  4em 0 0 0 red,
  -5em 1em 0 0 red,
  -4em 1em 0 0 red,
  4em 1em 0 0 red,
  5em 1em 0 0 red,
  -5em 2em 0 0 red,
  5em 2em 0 0 red,
  -5em 3em 0 0 red,
  -3em 3em 0 0 red,
  3em 3em 0 0 red,
  5em 3em 0 0 red,
  -2em 4em 0 0 red,
  -1em 4em 0 0 red,
  1em 4em 0 0 red,
  2em 4em 0 0 red;
  background: red;
  width: 1em;
  height: 1em;
  overflow: hidden;
  margin: 50px 0 70px 65px;
}
```

### 放大镜

![image.png](https://upload-images.jianshu.io/upload_images/12877063-29b25dd52475bbb3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# magnifying-glass {
  font-size: 10em;
  display: inline-block;
  width: 0.4em;
  box-sizing: content-box;
  height: 0.4em;
  border: 0.1em solid red;
  position: relative;
  border-radius: 0.35em;
}
# magnifying-glass:before {
  content: "";
  display: inline-block;
  position: absolute;
  right: -0.25em;
  bottom: -0.1em;
  border-width: 0;
  background: red;
  width: 0.35em;
  height: 0.08em;
  transform: rotate(45deg);
}
```

### 月亮

![image.png](https://upload-images.jianshu.io/upload_images/12877063-7a96a80537e45b4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# moon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 15px 15px 0 0 red;
}
```

### 锁

![image.png](https://upload-images.jianshu.io/upload_images/12877063-1f14dfe7721b1a2a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```css
# lock {
  font-size: 8px;
  position: relative;
  width: 18em;
  height: 13em;
  border-radius: 2em;
  top: 10em;
  box-sizing: border-box;
  border: 3.5em solid red;
  border-right-width: 7.5em;
  border-left-width: 7.5em;
  margin: 0 0 6rem 0;
}
# lock:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  border: 2.5em solid red;
  width: 14em;
  height: 12em;
  left: 50%;
  margin-left: -7em;
  top: -12em;
  border-top-left-radius: 7em;
  border-top-right-radius: 7em;
}
# lock:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  border: 1em solid red;
  width: 5em;
  height: 8em;
  border-radius: 2.5em;
  left: 50%;
  top: -1em;
  margin-left: -2.5em;
}
```

> 原文链接：[45 个值得收藏的 CSS 形状](https://juejin.im/post/6845166891879628808)
