<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:58:43
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/Vue/vue动画组件公用封装.md
-->

实现一个简单的逐渐显/隐的组件封装

```html
<template>
  <transition>
    <slop></slop>
  </transition>
</template>

<script>
  export default {
    name: "FadeAnimation",
  };
</script>

<style lang="scss" scope>
  .v-enter,
  .v-leave-to {
    opacity: 0;
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s;
  }
</style>
```

如何调用？

```html
<template>
  <div class="root">
    <FadeAnimation>
      <div v-show="isShow">hello world</div>
    </FadeAnimation>
  </div>
</template>

<script>
  import FadeAnimation from "./FadeAnimation";
  export default {
    name: "Index",
    components: {
      FadeAnimation,
    },
    data() {
      return {
        isShow: true,
      };
    },
  };
</script>

<style scoped></style>
```
