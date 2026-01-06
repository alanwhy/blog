<!--
 * @Author: wuhaoyuan
 * @Date: 2022-08-26 09:52:21
 * @LastEditTime: 2022-08-26 10:14:21
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/Vue/element-ui打包iconfont乱码问题.md
-->

# element-ui 打包 iconfont 乱码问题

## 相关依赖版本说明

```json
{
  "dependencies": {
    "element-ui": "^2.15.9",
    "vue": "^2.7.5"
  },
  "devDependencies": {
    "node-sass": "^7.0.1",
    "sass-loader": "^13.0.2"
  }
}
```

## 解决方案

### 方案一

利用 `css-unicode-loader` 把 `dart-sass` 编译的图标转换一下

```js
// vue.config.js
config.module.rules
  .filter((rule) => {
    return rule.test && rule.test.toString().indexOf("scss") !== -1;
  })
  .forEach((rule) => {
    rule.oneOf.forEach((oneOfRule) => {
      oneOfRule.use.splice(
        oneOfRule.use.indexOf(require.resolve("sass-loader")),
        0,
        {
          loader: require.resolve("css-unicode-loader"),
        }
      );
    });
  });
```

### 方案二

```js
css: {
    loaderOptions: {
        sass: {
            additionalData: `@import "@/styles/variables.scss";`, //引入全局变量
            sassOptions: { outputStyle: "expanded" }, // 解决dart-sass导致的偶发性乱码
        },
    },
},
```

### 方案三（未尝试）

将自定义主题引入入口文件 `@import "~element-ui/packages/theme-chalk/src/index.scss";` 中的内容解开引用，这里不去写具体内容，指的注意的是以下：

注意将第一个 `@import "./base.scss";` 再次解开为： `@import "./common/transition.scss";` 也就是将 内部的./icon.scss 排除掉

然后将 elementui 编译好的 icon.css 单独用 js 进行引入加载，即可解决

```scss
//这里写你的自定义主题变量配置

$--color-primary: #4b6eef;

//将入口文件的引用拆出来引用到这里

@import "~element-ui/packages/theme-chalk/src/pagination.scss";
@import "~element-ui/packages/theme-chalk/src/dialog.scss";
@import "~element-ui/packages/theme-chalk/src/autocomplete.scss";
@import "~element-ui/packages/theme-chalk/src/dropdown.scss";
@import "~element-ui/packages/theme-chalk/src/dropdown-menu.scss";
@import "~element-ui/packages/theme-chalk/src/dropdown-item.scss";
@import "~element-ui/packages/theme-chalk/src/menu.scss";
@import "~element-ui/packages/theme-chalk/src/submenu.scss";
@import "~element-ui/packages/theme-chalk/src/menu-item.scss";
@import "~element-ui/packages/theme-chalk/src/menu-item-group.scss";
@import "~element-ui/packages/theme-chalk/src/input.scss";
@import "~element-ui/packages/theme-chalk/src/input-number.scss";
@import "~element-ui/packages/theme-chalk/src/radio.scss";
@import "~element-ui/packages/theme-chalk/src/radio-group.scss";
@import "~element-ui/packages/theme-chalk/src/radio-button.scss";
@import "~element-ui/packages/theme-chalk/src/checkbox.scss";
@import "~element-ui/packages/theme-chalk/src/checkbox-button.scss";
@import "~element-ui/packages/theme-chalk/src/checkbox-group.scss";
@import "~element-ui/packages/theme-chalk/src/switch.scss";
@import "~element-ui/packages/theme-chalk/src/select.scss";
@import "~element-ui/packages/theme-chalk/src/button.scss";
@import "~element-ui/packages/theme-chalk/src/button-group.scss";
@import "~element-ui/packages/theme-chalk/src/table.scss";
@import "~element-ui/packages/theme-chalk/src/table-column.scss";
@import "~element-ui/packages/theme-chalk/src/date-picker.scss";
@import "~element-ui/packages/theme-chalk/src/time-select.scss";
@import "~element-ui/packages/theme-chalk/src/time-picker.scss";
@import "~element-ui/packages/theme-chalk/src/popover.scss";
@import "~element-ui/packages/theme-chalk/src/tooltip.scss";
@import "~element-ui/packages/theme-chalk/src/message-box.scss";
@import "~element-ui/packages/theme-chalk/src/breadcrumb.scss";
@import "~element-ui/packages/theme-chalk/src/breadcrumb-item.scss";
@import "~element-ui/packages/theme-chalk/src/form.scss";
@import "~element-ui/packages/theme-chalk/src/form-item.scss";
@import "~element-ui/packages/theme-chalk/src/tabs.scss";
@import "~element-ui/packages/theme-chalk/src/tab-pane.scss";
@import "~element-ui/packages/theme-chalk/src/tag.scss";
@import "~element-ui/packages/theme-chalk/src/tree.scss";
@import "~element-ui/packages/theme-chalk/src/alert.scss";
@import "~element-ui/packages/theme-chalk/src/notification.scss";
@import "~element-ui/packages/theme-chalk/src/slider.scss";
@import "~element-ui/packages/theme-chalk/src/loading.scss";
@import "~element-ui/packages/theme-chalk/src/row.scss";
@import "~element-ui/packages/theme-chalk/src/col.scss";
@import "~element-ui/packages/theme-chalk/src/upload.scss";
@import "~element-ui/packages/theme-chalk/src/progress.scss";
@import "~element-ui/packages/theme-chalk/src/spinner.scss";
@import "~element-ui/packages/theme-chalk/src/message.scss";
@import "~element-ui/packages/theme-chalk/src/badge.scss";
@import "~element-ui/packages/theme-chalk/src/card.scss";
@import "~element-ui/packages/theme-chalk/src/rate.scss";
@import "~element-ui/packages/theme-chalk/src/steps.scss";
@import "~element-ui/packages/theme-chalk/src/step.scss";
@import "~element-ui/packages/theme-chalk/src/carousel.scss";
@import "~element-ui/packages/theme-chalk/src/scrollbar.scss";
@import "~element-ui/packages/theme-chalk/src/carousel-item.scss";
@import "~element-ui/packages/theme-chalk/src/collapse.scss";
@import "~element-ui/packages/theme-chalk/src/collapse-item.scss";
@import "~element-ui/packages/theme-chalk/src/cascader.scss";
@import "~element-ui/packages/theme-chalk/src/color-picker.scss";
@import "~element-ui/packages/theme-chalk/src/transfer.scss";
@import "~element-ui/packages/theme-chalk/src/container.scss";
@import "~element-ui/packages/theme-chalk/src/header.scss";
@import "~element-ui/packages/theme-chalk/src/aside.scss";
@import "~element-ui/packages/theme-chalk/src/main.scss";
@import "~element-ui/packages/theme-chalk/src/footer.scss";
@import "~element-ui/packages/theme-chalk/src/timeline.scss";
@import "~element-ui/packages/theme-chalk/src/timeline-item.scss";
@import "~element-ui/packages/theme-chalk/src/link.scss";
@import "~element-ui/packages/theme-chalk/src/divider.scss";
@import "~element-ui/packages/theme-chalk/src/image.scss";
@import "~element-ui/packages/theme-chalk/src/calendar.scss";
@import "~element-ui/packages/theme-chalk/src/backtop.scss";
@import "~element-ui/packages/theme-chalk/src/infinite-scroll.scss";
@import "~element-ui/packages/theme-chalk/src/page-header.scss";
@import "~element-ui/packages/theme-chalk/src/cascader-panel.scss";
@import "~element-ui/packages/theme-chalk/src/avatar.scss";
@import "~element-ui/packages/theme-chalk/src/drawer.scss";
@import "~element-ui/packages/theme-chalk/src/popconfirm.scss";

// main.js
@import "element-ui/lib/theme-chalk/icon.css";
```

参考链接：[[Bug Report] 使用 dart-sass 打包 element icon 出现乱码 #21763](https://github.com/ElemeFE/element/issues/21763)
[页面刷新有时候 elementui 的字体图标会乱码](https://github.com/ElemeFE/element/issues/19247)
