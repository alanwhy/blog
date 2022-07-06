### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [input 搜索如何防抖，如何处理中文输入](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/129)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

中文输入问题

```html
<input
ref="input"
@compositionstart="handleComposition"
@compositionupdate="handleComposition"
@compositionend="handleComposition"
>
```

官方定义如下`compositionstart` 事件触发于一段文字的输入之前（类似于 `keydown` 事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）

简单来说就是切换中文输入法时在打拼音时(此时`input`内还没有填入真正的内容)，会首先触发`compositionstart`，然后每打一个拼音字母，触发`compositionupdate`，最后将输入好的中文填入input中时触发`compositionend`。触发`compositionstart`时，文本框会填入 “虚拟文本”（待确认文本），同时触发`input`事件；在触发`compositionend`时，就是填入实际内容后（已确认文本）,所以这里如果不想触发`input`事件的话就得设置一个`bool`变量来控制。
