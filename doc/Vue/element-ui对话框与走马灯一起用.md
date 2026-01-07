# 一、需求分析

通过点击一组图片中的某一张图片，显示出当前的图片在对话框中，并可以通过走马灯的方式左右切换出其他图片，图片大小和对话框大小为自适应 #二、实现步骤

## 1、布局代码

```html
<!--图片略缩图展示-->
<span class="tab-pic" v-if="isTabContentShow" v-for="data of tabledata">
  <img
    :src="item.dcid"
    v-if="item.format.toUpperCase() == 'JPEG' || item.format.toUpperCase() == 'PNG' || item.format.toUpperCase() == 'JPG'"
    @click="ShowBigPic($event, items.aList, index)"
    :title="items.startDate + '年 ' + data.name"
    v-for="(item, index) of items.aList"
    :key="item.dcid"
  />
  <div v-else class="data-null">
    <img src="static/img/null.png" style="cursor:default" />
    <div class="data-null-info">暂无图片</div>
  </div>
</span>
<!-- 图片弹窗 -->
<el-dialog
  :title="imgtitle"
  :visible.sync="dialogVisible"
  :before-close="closeBigPic"
  top="1vh"
  :width="this.dialogwidth"
>
  <div class="dialog-img">
    <el-carousel
      indicator-position="none"
      :autoplay="false"
      :initial-index="this.carouselArrIndex"
      :height="this.dialogheight"
      arrow="always"
      v-if="isCarouselShow"
      @change="changeCarousel"
    >
      <el-carousel-item v-for="carousel of carouselArr" :key="carousel.dcid">
        <img ref="carouselIMG" :src="carousel.dcid" />
      </el-carousel-item>
    </el-carousel>
  </div>
</el-dialog>
```

## 2、逻辑代码

### 2.1、data 中的设置

```js
  data() {
    return {
      imgsrc: '',
      imgtitle: '',
      carouselArr: [],
      carouselArrIndex: 0,
      radio: '1',
      activeName: '0',
      dialogheight: "500px",
      dialogwidth: "50%",
      ......
  },
```

### 2.2、方法代码

```js
  methods: {
    ......
    ShowBigPic(e, data, index) {
      let title = e.target.title
      this.imgtitle = title
      this.carouselArr = data
      this.carouselArrIndex = index
      this.dialogheight = e.target.naturalHeight.toString() + "px"
      this.dialogwidth = e.target.naturalWidth.toString() + "px"
      this.changeIsCarouselShow(true)
      this.changeDialogVisible(true)
    },
    changeCarousel(e) {
      this.dialogheight = this.$refs.carouselIMG[e].naturalHeight + "px"
      this.dialogwidth = this.$refs.carouselIMG[e].naturalWidth + "px"
    }
  },
```

## 3、样式表

自己搞定(╯•̀ὤ•́)╯ #三、效果展示
![图片展示.png](https://upload-images.jianshu.io/upload_images/12877063-55a3d2075881cc32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![图片弹出展示01.png](https://upload-images.jianshu.io/upload_images/12877063-c72869ddc7672765.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![图片弹出展示02.png](https://upload-images.jianshu.io/upload_images/12877063-e84249672cacef28.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 四、自卖自夸

- UI 设计很舒适，符合大众审美
- 图片展示方式很 nice
- 走马灯与对话框完美自适应
- 可用性很强啊！
