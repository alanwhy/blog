### 快速排序的 3 个基本步骤

1.从数组中选择一个元素作为基准点 2.排序数组，所有比基准值小的元素摆放在左边，而大于基准值的摆放在右边。每次分割结束以后基准值会插入到中间去。 3.最后利用递归，将摆放在左边的数组和右边的数组在进行一次上述的 1 和 2 操作。

![3个基本步骤.png](https://upload-images.jianshu.io/upload_images/12877063-f81761a4262a1dd4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

图片描述：

- 选择左右边的元素为基准数，7
- 将小于 7 的放在左边，大于 7 的放在右边，然后将基准数放到中间
- 然后再重复操作从左边的数组选择一个基准点 2
- 3 比 2 大则放到基准树的右边
- 右边的数组也是一样选择 12 作为基准数，15 比 12 大所以放到了 12 的右边
- 最后出来的结果就是从左到右 2 ，3，7，12，15 了

### 1、代码实现 1.0

```js
var quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
};
```

这段代码

优点：

- 代码简单明了，可读性强，易于理解
- 非常适合用于面试笔试题

缺点：

- 获取基准点使用了一个 splice 操作，在 js 中 splice 会对数组进行一次拷贝的操作，而它最坏的情况下复杂度为 O(n)，而 O(n)代表着针对数组规模的大小进行了一次循环操作。
- 首先我们每次执行都会使用到两个数组空间，产生空间复杂度。
- concat 操作会对数组进行一次拷贝，而它的复杂度也会是 O(n)
- 对大量数据的排序来说相对会比较慢

### 2、代码实现 2.0

![代码实现2.0.png](https://upload-images.jianshu.io/upload_images/12877063-1f09ae94e3f57e85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
从上面这张图，我们用一个指针 i 去做了一个分割

- 初始化 i = -1
- 循环数组，找到比支点小的数就将 i 向右移动一个位置，同时与下标 i 交换位置
- 循环结束后，最后将支点与 i+1 位置的元素进行交换位置
- 最后我们会得到一个由 i 指针作为分界点，分割成从下标 0-i，和 i+1 到最后一个元素。

整个代码分成三部分，数组交换，拆分（就是对指针进行移动，找到最后指针所指向的位置），qsort（主函数：通过递归去重复的调用进行拆分，一直拆分到只有一个数字）三个部分

```js
function swap(A, i, j) {
  const t = A[i];
  A[i] = A[j];
  A[j] = t;
}

/**
 *
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function divide(A, p, r) {
  const x = A[r - 1];
  let i = p - 1;

  for (let j = p; j < r - 1; j++) {
    if (A[j] <= x) {
      i++;
      swap(A, i, j);
    }
  }

  swap(A, i + 1, r - 1);

  return i + 1;
}

/**
 *
 * @param {*} A  数组
 * @param {*} p  起始下标
 * @param {*} r  结束下标 + 1
 */
function qsort(A, p = 0, r) {
  r = r || A.length;

  if (p < r - 1) {
    const q = divide(A, p, r);
    qsort(A, p, q);
    qsort(A, q + 1, r);
  }

  return A;
}
```

优点：

- 减少了两个 O(n)的操作，得到了一定的性能上的提升

> 参考原文：[js 算法-快速排序(Quicksort)](https://segmentfault.com/a/1190000017814119)
