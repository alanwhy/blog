实现一个简单的逐渐显/隐的组件封装
```
<template>
  <transition>
    <slop></slop>
  </transition>
</template>

<script>
export default {
  name: "FadeAnimation"
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
```
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
    FadeAnimation
  },
  data() {
    return {
      isShow: true
    };
  }
};
</script>

<style scoped>
</style>
```
