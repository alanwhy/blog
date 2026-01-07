### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [问题原文链接](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)

### 正文回答

#### 基于没有 key 的情况 diff 速度会更快

没有绑定 key 的情况下，并且在遍历模板简单的情况下，会导致虚拟新旧节点对比更快，节点也会复用。
而这种复用是`就地复用`，一种`鸭子辩型`的复用。

```js
vm.dataList = [4, 1, 3, 5, 2][ // 数据位置替换
  // 没有key的情况， 节点位置不变，但是节点innerText内容更新了
  ("<div>4</div>", // id： A
  "<div>1</div>", // id:  B
  "<div>3</div>", // id:  C
  "<div>5</div>", // id:  D
  "<div>2</div>") // id:  E
][
  // 有key的情况，dom节点位置进行了交换，但是内容没有更新
  // <div v-for="i in dataList" :key='i'>{{ i }}</div>
  ("<div>4</div>", // id： D
  "<div>1</div>", // id:  A
  "<div>3</div>", // id:  C
  "<div>5</div>", // id:  E
  "<div>2</div>") // id:  B
];
```

```js
vm.dataList = [3, 4, 5, 6, 7][ // 数据进行增删
  // 1. 没有key的情况， 节点位置不变，内容也更新了
  ("<div>3</div>", // id： A
  "<div>4</div>", // id:  B
  "<div>5</div>", // id:  C
  "<div>6</div>", // id:  D
  "<div>7</div>") // id:  E
][
  // 2. 有key的情况， 节点删除了 A, B 节点，新增了 F, G 节点
  // <div v-for="i in dataList" :key='i'>{{ i }}</div>
  ("<div>3</div>", // id： C
  "<div>4</div>", // id:  D
  "<div>5</div>", // id:  E
  "<div>6</div>", // id:  F
  "<div>7</div>") // id:  G
];
```

从以上来看，不带有 key，并且使用简单的模板，基于这个前提下，可以更有效的复用节点，diff 速度来看也是不带 key 更加快速的，因为带 key 在增删节点上有耗时。
这就是 vue 文档所说的`默认模式`。但是这个并不是 key 作用，而是没有 key 的情况下可以对节点就地复用，提高性能。
这种模式会带来一些隐藏的副作用，比如可能不会产生过渡效果，或者在某些节点有绑定数据（表单）状态，会出现状态错位。
VUE 文档也说明了  [**这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出**](https://cn.vuejs.org/v2/guide/list.html#key)

#### key 的作用

> key 是给每一个`vnode`的唯一 id,可以依靠`key`,**更准确**, **更快**的拿到`oldVnode`中对应的`vnode`节点。

1. 更准确：因为带 key 就不是`就地复用`了，在`sameNode`函数 `a.key === b.key`对比中可以避免就地复用的情况。所以会更加准确。
2. 更快：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快。

#### diff 算法的一些说明

在交叉对比中，当新节点跟旧节点头尾交叉对比没有结果时，会根据新节点的 key 去对比旧节点数组中的 key，从而找到相应旧节点（这里对应的是一个 key => index 的 map 映射）。如果没找到就认为是一个新增节点。而如果没有 key，那么就会采用遍历查找的方式去找到对应的旧节点。一种一个 map 映射，另一种是遍历查找。相比而言。map 映射的速度更快。

```js
// vue项目  src/core/vdom/patch.js  -488行
// 以下是为了阅读性进行格式化后的代码

// oldCh 是一个旧虚拟节点数组
if (isUndef(oldKeyToIdx)) {
  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
}

if (isDef(newStartVnode.key)) {
  // map 方式获取
  idxInOld = oldKeyToIdx[newStartVnode.key];
} else {
  // 遍历方式获取
  idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
}

// 创建map函数
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

// 遍历寻找
// sameVnode 是对比新旧节点是否相同的函数
function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i];

    if (isDef(c) && sameVnode(node, c)) return i;
  }
}
```

#### 简单的说法

- key 的作用是为了在数据变化时强制更新组件，以避免“原地复用”带来的副作用。另外，某些情况下不带 key 可能性能更好
- 主要是为了提升 diff【同级比较】的效率。自己想一下自己要实现前后列表的 diff，如果对列表的每一项增加一个 key，即唯一索引，那就可以很清楚的知道两个列表谁少了谁没变。而如果不加 key 的话，就只能一个个对比了。
- 官网推荐的使用 key，应该理解为“使用唯一 id 作为 key”。**因为 index 作为 key，和不带 key 的效果是一样的**。index 作为 key 时，每个列表项的 index 在变更前后也是一样的，都是直接判断为 sameVnode 然后复用。

#### 举一些实际应用

一个新闻列表，可点击列表项来将其标记为"已访问"，可通过 tab 切换“娱乐新闻”或是“社会新闻”。

不带 key 属性的情况下，在“娱乐新闻”下选中第二项然后切换到“社会新闻”，"社会新闻"里的第二项也会是被选中的状态，因为这里复用了组件，保留了之前的状态。

要解决这个问题，可以为列表项带上新闻 id 作为唯一 key，那么每次渲染列表时都会完全替换所有组件，使其拥有正确状态。

带上唯一 key 虽然会增加开销，但是对于用户来说基本感受不到差距，而且能保证组件状态正确，这应该就是为什么推荐使用唯一 id 作为 key 的原因。
